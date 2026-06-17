/* eslint-env node */
import axios from 'axios';
import process from 'node:process';

const {
  ZARINPAL_MERCHANT_ID,
  ZARINPAL_SANDBOX = 'false',
} = process.env;

const isSandbox = ZARINPAL_SANDBOX === 'true';
const baseUrl = isSandbox
  ? 'https://sandbox.zarinpal.com/pg/v4'
  : 'https://api.zarinpal.com/pg/v4';

/**
 * ایجاد درخواست پرداخت
 */
export const createPaymentRequest = async ({ amount, description, callbackUrl, metadata = {} }) => {
  if (!ZARINPAL_MERCHANT_ID) {
    throw new Error('ZARINPAL_MERCHANT_ID تنظیم نشده است');
  }

  console.log('Creating payment request:', {
    amount,
    description,
    callbackUrl,
    metadata,
    merchantId: ZARINPAL_MERCHANT_ID,
    isSandbox,
  });

  try {
    // ساخت metadata فقط اگر mobile یا email وجود داشته باشه
    const paymentMetadata = {};
    const mobile = String(metadata.mobile || metadata.phone || '').trim();
    const email = String(metadata.email || '').trim();
    
    if (mobile) {
      paymentMetadata.mobile = mobile;
    }
    if (email) {
      paymentMetadata.email = email;
    }

    const requestBody = {
      merchant_id: ZARINPAL_MERCHANT_ID,
      amount: Math.round(amount),
      description: description || 'خرید از لنت شاپ',
      callback_url: callbackUrl,
    };

    // فقط اگر metadata داریم، اضافه می‌کنیم
    if (Object.keys(paymentMetadata).length > 0) {
      requestBody.metadata = paymentMetadata;
    }

    const response = await axios.post(
      `${baseUrl}/payment/request.json`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    console.log('Zarinpal response:', JSON.stringify(data, null, 2));

    // چک کردن خطا: اگر errors وجود داشته باشه و خالی نباشه
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMessage = data.errors[0]?.message || data.errors.message || 'خطا در ایجاد درخواست پرداخت';
      console.error('Zarinpal error:', data.errors);
      throw new Error(errorMessage);
    }

    if (data.data && data.data.code === 100) {
      const authority = data.data.authority;
      const paymentUrl = isSandbox
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

      return {
        success: true,
        authority,
        paymentUrl,
        code: data.data.code,
      };
    }

    throw new Error(data.data?.message || 'خطا در ایجاد درخواست پرداخت');
  } catch (error) {
    console.error('Payment request error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    if (error.response?.data) {
      const zarinpalError = error.response.data;
      throw new Error(zarinpalError.errors?.message || error.message || 'خطا در ارتباط با زرین‌پال');
    }
    throw error;
  }
};

/**
 * تایید پرداخت
 */
export const verifyPayment = async ({ authority, amount }) => {
  if (!ZARINPAL_MERCHANT_ID) {
    throw new Error('ZARINPAL_MERCHANT_ID تنظیم نشده است');
  }

  try {
    const response = await axios.post(
      `${baseUrl}/payment/verify.json`,
      {
        merchant_id: ZARINPAL_MERCHANT_ID,
        authority,
        amount: Math.round(amount),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    if (data.errors) {
      const errorMessage = data.errors.message || 'خطا در تایید پرداخت';
      return {
        success: false,
        error: errorMessage,
        code: data.errors.code,
      };
    }

    if (data.data && data.data.code === 100) {
      return {
        success: true,
        refId: data.data.ref_id,
        cardHash: data.data.card_hash,
        cardPan: data.data.card_pan,
        fee: data.data.fee,
        feeType: data.data.fee_type,
        code: data.data.code,
      };
    }

    if (data.data && data.data.code === 101) {
      return {
        success: false,
        error: 'این تراکنش قبلاً تایید شده است',
        code: data.data.code,
      };
    }

    return {
      success: false,
      error: data.data?.message || 'پرداخت ناموفق بود',
      code: data.data?.code,
    };
  } catch (error) {
    if (error.response?.data) {
      const zarinpalError = error.response.data;
      throw new Error(zarinpalError.errors?.message || error.message || 'خطا در ارتباط با زرین‌پال');
    }
    throw error;
  }
};

