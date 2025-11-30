/* eslint-env node */
import crypto from 'node:crypto';
import process from 'node:process';
import supabaseAdmin from '../supabaseAdminClient.js';
import { sendOtpSms } from '../sms/farazSmsClient.js';
import { normalizeIranPhoneNumber } from '../utils/phone.js';

const OTP_EXPIRATION_MINUTES = Number(process.env.OTP_EXPIRATION_MINUTES ?? 2);

const RATE_LIMIT_MAX_PER_HOUR = Number(process.env.OTP_MAX_PER_HOUR ?? 5);

const RATE_LIMIT_WINDOW_MINUTES = 60;

const OTP_TABLE = process.env.OTP_TABLE_NAME ?? 'otp_requests';

const OTP_EMAIL_DOMAIN = process.env.OTP_EMAIL_DOMAIN ?? 'otp.lentshop.local';

const isDev = process.env.NODE_ENV !== 'production';

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const buildPseudoEmail = (phone) => {
  const localPart = phone.replace(/[^\d]/g, '');
  return `${localPart}@${OTP_EMAIL_DOMAIN}`;
};

const toE164Phone = (phone) => {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length === 11 && digits.startsWith('0')
    ? `+98${digits.slice(1)}`
    : `+98${digits.slice(-10)}`;
};

const ensureUserExists = async (email, phone, e164Phone) => {
  const result = await supabaseAdmin.auth.admin.createUser({
    email,
    phone: e164Phone,
    email_confirm: false,
    phone_confirm: false,
    user_metadata: {
      phone,
    },
  });

  if (result.error) {
    const message = (result.error.message || '').toLowerCase();
    const status = Number(result.error.status ?? 0);
    // Ignore duplicate errors (user already exists)
    if (
      message.includes('already') ||
      message.includes('duplicate') ||
      status === 409 ||
      status === 422
    ) {
      return null;
    }
    throw result.error;
  }

  return result.data?.user ?? null;
};

const generateMagiclinkOtp = async (email, phone) => {
  const result = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      data: {
        phone,
      },
    },
  });

  if (result.error) {
    throw result.error;
  }

  return result.data;
};

export const sendOtpToPhone = async (rawPhone) => {
  const phone = normalizeIranPhoneNumber(rawPhone);

  if (!phone) {
    throw new Error('شماره موبایل معتبر نیست');
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);

  const { count: recentCount, error: countError } = await supabaseAdmin
    .from(OTP_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', windowStart.toISOString());

  if (countError) {
    throw new Error('خطا در بررسی محدودیت ارسال کد');
  }

  if ((recentCount ?? 0) >= RATE_LIMIT_MAX_PER_HOUR) {
    throw new Error('تعداد درخواست‌های کد تایید بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.');
  }

  const pseudoEmail = buildPseudoEmail(phone);
  const e164Phone = toE164Phone(phone);

  await ensureUserExists(pseudoEmail, phone, e164Phone);

  const { properties, user } = await generateMagiclinkOtp(pseudoEmail, phone);

  const supabaseOtp = properties?.email_otp;
  const verificationType = properties?.verification_type ?? 'magiclink';

  if (!supabaseOtp) {
    throw new Error('کد تایید از Supabase دریافت نشد');
  }

  const expiresAt = new Date(now.getTime() + OTP_EXPIRATION_MINUTES * 60 * 1000).toISOString();

  if (isDev) {
    console.log(`[DEV] OTP for ${phone} (${pseudoEmail}): ${supabaseOtp}`);
  }

  const message = (process.env.OTP_SMS_TEMPLATE ?? 'کد تایید شما: {code}').replace('{code}', supabaseOtp);

  const sendResult = await sendOtpSms(phone, message);

  if (!sendResult.success) {
    console.error('Faraz SMS error:', sendResult.providerResponse);
    throw new Error(sendResult.error ?? 'ارسال پیامک ناموفق بود');
  }

  const { error: insertError } = await supabaseAdmin
    .from(OTP_TABLE)
    .insert({
      phone,
      hashed_code: hashOtp(supabaseOtp),
      expires_at: expiresAt,
      channel: 'sms',
      metadata: {
        pseudoEmail,
        verificationType,
        supabaseUserId: user?.id ?? null,
        providerResponse: sendResult.providerResponse ?? null,
      },
    });

  if (insertError) {
    throw insertError;
  }

  return { phone, pseudoEmail, verificationType };
};

export const verifyOtpForPhone = async (rawPhone, code) => {
  const phone = normalizeIranPhoneNumber(rawPhone);

  if (!phone) {
    throw new Error('شماره موبایل معتبر نیست');
  }

  if (!/^\d{4,6}$/.test(code)) {
    throw new Error('کد تایید معتبر نیست');
  }

  const hashed = hashOtp(code);

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from(OTP_TABLE)
    .select('id, expires_at, consumed_at, metadata')
    .eq('phone', phone)
    .eq('hashed_code', hashed)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (!existing) {
    throw new Error('کد وارد شده صحیح نیست');
  }

  if (existing.consumed_at) {
    throw new Error('این کد قبلاً استفاده شده است');
  }

  if (new Date(existing.expires_at) < new Date()) {
    throw new Error('کد تایید منقضی شده است');
  }

  await supabaseAdmin
    .from(OTP_TABLE)
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', existing.id);

  const pseudoEmail = existing.metadata?.pseudoEmail ?? buildPseudoEmail(phone);
  const verificationType = existing.metadata?.verificationType ?? 'magiclink';

  return {
    success: true,
    pseudoEmail,
    verificationType,
  };
};


