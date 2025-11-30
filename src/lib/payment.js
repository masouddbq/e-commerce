/**
 * Payment Gateway Integration
 * آماده برای اتصال به درگاه‌های پرداخت مختلف
 */

// تنظیمات درگاه‌های پرداخت
export const PAYMENT_GATEWAYS = {
  ZARINPAL: {
    name: 'زرین‌پال',
    merchantId: import.meta.env.VITE_ZARINPAL_MERCHANT_ID || 'test_merchant_id',
    apiKey: import.meta.env.VITE_ZARINPAL_API_KEY || 'test_api_key',
    callbackUrl: import.meta.env.VITE_ZARINPAL_CALLBACK_URL || 'http://localhost:3000/payment/callback',
    sandbox: import.meta.env.VITE_ZARINPAL_SANDBOX === 'true' || true,
    enabled: true
  },
  PAYPING: {
    name: 'پی‌پینگ',
    merchantId: import.meta.env.VITE_PAYPING_MERCHANT_ID || 'test_merchant_id',
    apiKey: import.meta.env.VITE_PAYPING_API_KEY || 'test_api_key',
    callbackUrl: import.meta.env.VITE_PAYPING_CALLBACK_URL || 'http://localhost:3000/payment/callback',
    sandbox: import.meta.env.VITE_PAYPING_SANDBOX === 'true' || true,
    enabled: false
  },
  IDPAY: {
    name: 'آیدی‌پی',
    merchantId: import.meta.env.VITE_IDPAY_MERCHANT_ID || 'test_merchant_id',
    apiKey: import.meta.env.VITE_IDPAY_API_KEY || 'test_api_key',
    callbackUrl: import.meta.env.VITE_IDPAY_CALLBACK_URL || 'http://localhost:3000/payment/callback',
    sandbox: import.meta.env.VITE_IDPAY_SANDBOX === 'true' || true,
    enabled: false
  }
};

// وضعیت‌های پرداخت
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// روش‌های پرداخت
export const PAYMENT_METHODS = {
  ONLINE: {
    id: 'online',
    name: 'پرداخت آنلاین',
    description: 'پرداخت از طریق درگاه بانکی',
    icon: '💳',
    enabled: true
  },
  CARD_TO_CARD: {
    id: 'card_to_card',
    name: 'کارت به کارت',
    description: 'انتقال وجه مستقیم',
    icon: '🏦',
    enabled: true
  },
  WALLET: {
    id: 'wallet',
    name: 'کیف پول',
    description: 'پرداخت از موجودی حساب',
    icon: '💰',
    enabled: false
  }
};

/**
 * کلاس مدیریت پرداخت
 */
export class PaymentManager {
  constructor() {
    this.currentGateway = null;
    this.paymentData = null;
  }

  /**
   * انتخاب درگاه پرداخت
   */
  selectGateway(gatewayName) {
    const gateway = PAYMENT_GATEWAYS[gatewayName];
    if (!gateway || !gateway.enabled) {
      throw new Error(`درگاه ${gatewayName} فعال نیست`);
    }
    this.currentGateway = gateway;
    return this;
  }

  /**
   * تنظیم اطلاعات پرداخت
   */
  setPaymentData(data) {
    this.paymentData = {
      amount: data.amount,
      description: data.description,
      orderId: data.orderId,
      customerInfo: data.customerInfo,
      callbackUrl: data.callbackUrl || this.currentGateway.callbackUrl,
      ...data
    };
    return this;
  }

  /**
   * ایجاد درخواست پرداخت
   */
  async createPaymentRequest() {
    if (!this.currentGateway) {
      throw new Error('درگاه پرداخت انتخاب نشده است');
    }

    if (!this.paymentData) {
      throw new Error('اطلاعات پرداخت تنظیم نشده است');
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    try {
      // تبدیل قیمت از تومان به ریال (ضرب در 10)
      const amountInRials = Math.round((this.paymentData.amount || 0) * 10);

      const response = await fetch(`${API_BASE_URL}/api/payment/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInRials, // قیمت به ریال
          description: this.paymentData.description,
          callbackUrl: this.paymentData.callbackUrl,
          orderId: this.paymentData.orderId,
          metadata: {
            mobile: this.paymentData.customerInfo?.phone || '',
            email: this.paymentData.customerInfo?.email || '',
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'خطا در ایجاد درخواست پرداخت');
      }

      return {
        success: true,
        paymentUrl: result.paymentUrl,
        authority: result.authority,
        message: 'درخواست پرداخت با موفقیت ایجاد شد',
      };
    } catch (error) {
      throw new Error(error.message || 'خطا در ارتباط با سرور پرداخت');
    }
  }

  /**
   * تایید پرداخت
   */
  async verifyPayment(authority, amount, orderId) {
    if (!this.currentGateway) {
      throw new Error('درگاه پرداخت انتخاب نشده است');
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authority,
          amount,
          orderId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'پرداخت ناموفق بود');
      }

      return {
        success: true,
        refId: result.refId,
        cardHash: result.cardHash,
        cardPan: result.cardPan,
        message: 'پرداخت با موفقیت انجام شد',
      };
    } catch (error) {
      throw new Error(error.message || 'خطا در ارتباط با سرور پرداخت');
    }
  }

  /**
   * دریافت وضعیت پرداخت
   */
  async getPaymentStatus(paymentId) {
    // TODO: پیاده‌سازی دریافت وضعیت از دیتابیس
    return PAYMENT_STATUS.PENDING;
  }
}

/**
 * تابع کمکی برای فرمت کردن مبلغ
 */
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount);
};

/**
 * تابع کمکی برای اعتبارسنجی اطلاعات پرداخت
 */
export const validatePaymentData = (data) => {
  const errors = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('مبلغ پرداخت نامعتبر است');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('توضیحات پرداخت الزامی است');
  }

  if (!data.customerInfo || !data.customerInfo.email) {
    errors.push('ایمیل مشتری الزامی است');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * تابع کمکی برای ایجاد URL پرداخت
 */
export const createPaymentUrl = (gateway, paymentData) => {
  const baseUrls = {
    ZARINPAL: 'https://sandbox.zarinpal.com/pg/StartPay/',
    PAYPING: 'https://api.payping.ir/v2/pay/',
    IDPAY: 'https://api.idpay.ir/v1.1/payment/'
  };

  return `${baseUrls[gateway]}${paymentData.authority}`;
};

export default PaymentManager;
