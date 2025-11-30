/* eslint-env node */
import axios from 'axios';
import process from 'node:process';

const {
  FARAZ_SMS_API_URL = 'https://ippanel.com/api/select',
  FARAZ_SMS_USERNAME,
  FARAZ_SMS_PASSWORD,
  FARAZ_SMS_SENDER_NUMBER,
  FARAZ_SMS_PATTERN_CODE,
} = process.env;

const hasPattern = Boolean(FARAZ_SMS_PATTERN_CODE);

export const sendOtpSms = async (phone, message) => {
  if (!FARAZ_SMS_USERNAME || !FARAZ_SMS_PASSWORD || !FARAZ_SMS_SENDER_NUMBER) {
    return { success: false, error: 'تنظیمات پنل پیامکی کامل نیست' };
  }

  try {
    if (hasPattern) {
      const payload = {
        op: 'pattern',
        user: FARAZ_SMS_USERNAME,
        pass: FARAZ_SMS_PASSWORD,
        fromNum: FARAZ_SMS_SENDER_NUMBER,
        toNum: phone,
        patternCode: FARAZ_SMS_PATTERN_CODE,
        inputData: [
          {
            'verification-code': message.match(/\d+/)?.[0] ?? message,
          },
        ],
      };

      const { data } = await axios.post(FARAZ_SMS_API_URL, payload, { timeout: 10000 });
      return handleFarazResponse(data);
    }

    const payload = {
      op: 'send',
      uname: FARAZ_SMS_USERNAME,
      pass: FARAZ_SMS_PASSWORD,
      message,
      from: FARAZ_SMS_SENDER_NUMBER,
      to: [phone],
    };

    const { data } = await axios.post(FARAZ_SMS_API_URL, payload, { timeout: 10000 });
    return handleFarazResponse(data);
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || 'خطای ناشناخته در ارسال پیامک',
      providerResponse: error?.response?.data,
    };
  }
};

const handleFarazResponse = (data) => {
  if (!data) {
    return { success: false, error: 'پاسخ نامعتبر از سرویس پیامکی' };
  }

  if (Array.isArray(data) && String(data[0]) === '0') {
    return { success: true, providerResponse: data };
  }

  if (typeof data === 'object' && data?.status === 'success') {
    return { success: true, providerResponse: data };
  }

  return {
    success: false,
    error: data?.message || 'ارسال پیامک با خطا مواجه شد',
    providerResponse: data,
  };
};


