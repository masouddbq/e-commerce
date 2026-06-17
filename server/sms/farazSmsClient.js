/* eslint-env node */
import axios from 'axios';
import process from 'node:process';

const {
  FARAZ_SMS_API_URL = 'https://edge.ippanel.com/v1', // Edge API جدید
  FARAZ_SMS_USERNAME,
  FARAZ_SMS_PASSWORD,
  FARAZ_SMS_API_KEY, // کلید API جدید (الزامی برای Edge API)
  FARAZ_SMS_SENDER_NUMBER,
  FARAZ_SMS_PATTERN_CODE,
  FARAZ_SMS_PATTERN_VARIABLE_NAME = 'OTP', // نام متغیر در Pattern (پیش‌فرض: OTP)
  FARAZ_SMS_PATTERN_TOKEN_COUNT = '1', // تعداد token های Pattern (پیش‌فرض: 1) - اگر Pattern چند token داره، این رو تنظیم کن (مثلاً "2" یا "3")
} = process.env;

const hasPattern = Boolean(FARAZ_SMS_PATTERN_CODE);

export const sendOtpSms = async (phone, message) => {
  console.log('[Faraz SMS] Starting SMS send request');
  console.log('[Faraz SMS] Phone:', phone);
  console.log('[Faraz SMS] Message:', message);
  console.log('[Faraz SMS] Sender:', FARAZ_SMS_SENDER_NUMBER);
  console.log('[Faraz SMS] Username:', FARAZ_SMS_USERNAME ? `${FARAZ_SMS_USERNAME.substring(0, 3)}***` : 'NOT SET');
  console.log('[Faraz SMS] Username length:', FARAZ_SMS_USERNAME?.length || 0);
  console.log('[Faraz SMS] Username (first 5 chars):', FARAZ_SMS_USERNAME ? FARAZ_SMS_USERNAME.substring(0, 5) : 'NOT SET');
  console.log('[Faraz SMS] Password:', FARAZ_SMS_PASSWORD ? `${FARAZ_SMS_PASSWORD.substring(0, 3)}***` : 'NOT SET');
  console.log('[Faraz SMS] Password length:', FARAZ_SMS_PASSWORD?.length || 0);
  console.log('[Faraz SMS] Password (first 5 chars):', FARAZ_SMS_PASSWORD ? FARAZ_SMS_PASSWORD.substring(0, 5) : 'NOT SET');
  console.log('[Faraz SMS] Pattern Code:', FARAZ_SMS_PATTERN_CODE || 'NOT SET (using direct send)');
  console.log('[Faraz SMS] Has Pattern:', hasPattern);

  // Edge API جدید فقط از API Key استفاده می‌کنه
  if (!FARAZ_SMS_API_KEY || !FARAZ_SMS_SENDER_NUMBER) {
    console.error('[Faraz SMS] Missing API Key or Sender Number');
    return { success: false, error: 'تنظیمات پنل پیامکی کامل نیست (API Key یا شماره سرشماره تنظیم نشده)' };
  }
  
  console.log('[Faraz SMS] Using Edge API with API Key authentication');
  console.log('[Faraz SMS] API Key:', FARAZ_SMS_API_KEY ? `${FARAZ_SMS_API_KEY.substring(0, 5)}***` : 'NOT SET');
  console.log('[Faraz SMS] API Key length:', FARAZ_SMS_API_KEY?.length || 0);
  console.log('[Faraz SMS] API Key (first 10 chars):', FARAZ_SMS_API_KEY ? FARAZ_SMS_API_KEY.substring(0, 10) : 'NOT SET');
  console.log('[Faraz SMS] API Key (last 5 chars):', FARAZ_SMS_API_KEY && FARAZ_SMS_API_KEY.length > 5 ? `***${FARAZ_SMS_API_KEY.substring(FARAZ_SMS_API_KEY.length - 5)}` : 'NOT SET');
  console.log('[Faraz SMS] API Key trimmed:', FARAZ_SMS_API_KEY?.trim() ? `${FARAZ_SMS_API_KEY.trim().substring(0, 5)}***` : 'NOT SET');

  try {
    if (hasPattern) {
      // تبدیل شماره موبایل به فرمت بدون 0 اول (برای Pattern API)
      const phoneForPattern = phone.startsWith('0') ? phone.slice(1) : phone;
      const otpCodeString = message.match(/\d+/)?.[0] ?? message;
      // تبدیل OTP به عدد (چون در Pattern نوع متغیر OTP عدد هست)
      const otpCodeNumber = Number(otpCodeString);
      
      // دو فرمت مختلف برای inputData تست می‌کنیم
      // فرمت 1: Array of objects (فرمت فعلی) - با OTP به صورت عدد
      const inputDataArray = [
        {
          'OTP': otpCodeNumber,
        },
      ];
      
      // فرمت 2: Object directly (فرمت جایگزین) - با OTP به صورت عدد
      const inputDataObject = {
        'OTP': otpCodeNumber,
      };
      
      // Edge API جدید: استفاده از endpoint /api/send
      // تبدیل شماره‌ها به فرمت E.164 (با +98)
      // شماره سرشماره باید بدون 0 اول باشه (مثلاً 3000505 نه 03000505)
      let senderNumber = FARAZ_SMS_SENDER_NUMBER?.trim() || '';
      // اگر با 0 شروع می‌شه، 0 اول رو برمی‌داریم
      if (senderNumber.startsWith('0')) {
        senderNumber = senderNumber.slice(1);
      }
      const fromNumberE164 = `+98${senderNumber}`;
      const recipientE164 = `+98${phoneForPattern}`;
      
      // Payload برای Edge API (بر اساس مستندات و curl example از پشتیبانی Faraz SMS)
      // توجه: نام متغیر از environment variable میاد، اگر تنظیم نشده باشه، از 'OTP' استفاده می‌کنه (پیش‌فرض)
      // از پنل Faraz SMS: متغیر "OTP | عدد" و متن پترن: "کد تایید شما : %OTP% فروشگاه لنت شاپ"
      const envVarName = process.env.FARAZ_SMS_PATTERN_VARIABLE_NAME?.trim();
      const patternVariableName = envVarName || 'OTP'; // پیش‌فرض: 'OTP' (طبق پنل Faraz SMS)
      console.log('[Faraz SMS] Pattern Variable Name (from env or default):', patternVariableName);
      console.log('[Faraz SMS] Env var FARAZ_SMS_PATTERN_VARIABLE_NAME:', envVarName || 'NOT SET (using default: OTP)');
      console.log('[Faraz SMS] Pattern uses variable:', patternVariableName, '(as per Faraz SMS panel configuration)');
      
      // چند فرمت مختلف برای params تست می‌کنیم:
      // فرمت 1: Object با نام متغیر (فرمت فعلی)
      const paramsObject = {
        [patternVariableName]: otpCodeNumber,
      };
      
      // فرمت 2: Object با نام متغیر به صورت lowercase (اگر مشکل از case sensitivity باشه)
      const paramsObjectLower = {
        [patternVariableName.toLowerCase()]: otpCodeNumber,
      };
      
      // فرمت 3: Array of objects (برخی API ها این فرمت رو می‌خوان)
      const paramsArray = [
        {
          [patternVariableName]: otpCodeNumber,
        },
      ];
      
      // استفاده از فرمت 1 (object) - اگر کار نکرد، می‌تونیم فرمت دیگه رو تست کنیم
      const params = paramsObject;
      
      // Payload برای Edge API
      const payload = {
        sending_type: 'pattern',
        from_number: fromNumberE164,
        code: FARAZ_SMS_PATTERN_CODE?.trim(),
        recipients: [recipientE164],
        params: params,
      };
      
      console.log('[Faraz SMS] Original phone:', phone);
      console.log('[Faraz SMS] Phone for Pattern API:', phoneForPattern);
      console.log('[Faraz SMS] OTP code (string):', otpCodeString);
      console.log('[Faraz SMS] OTP code (number):', otpCodeNumber);
      console.log('[Faraz SMS] OTP code type:', typeof otpCodeNumber);
      console.log('[Faraz SMS] Pattern Variable Name (final):', patternVariableName);
      console.log('[Faraz SMS] Using variable name:', patternVariableName, '(from FARAZ_SMS_PATTERN_VARIABLE_NAME or default: OTP)');
      console.log('[Faraz SMS] All env vars check:', {
        'FARAZ_SMS_PATTERN_VARIABLE_NAME': process.env.FARAZ_SMS_PATTERN_VARIABLE_NAME,
        'FARAZ_SMS_PATTERN_CODE': process.env.FARAZ_SMS_PATTERN_CODE,
        'FARAZ_SMS_SENDER_NUMBER': process.env.FARAZ_SMS_SENDER_NUMBER,
      });
      console.log('[Faraz SMS] Variable type: number (as per Pattern configuration)');
      console.log('[Faraz SMS] OTP value:', otpCodeNumber, '(type:', typeof otpCodeNumber, ')');
      console.log('[Faraz SMS] Params object (format 1):', JSON.stringify(paramsObject, null, 2));
      console.log('[Faraz SMS] Params object (format 2 - lowercase):', JSON.stringify(paramsObjectLower, null, 2));
      console.log('[Faraz SMS] Params array (format 3):', JSON.stringify(paramsArray, null, 2));
      console.log('[Faraz SMS] Using params format:', 'Object (format 1)');
      console.log('[Faraz SMS] Params keys:', Object.keys(params));
      console.log('[Faraz SMS] Params count:', Object.keys(params).length, '- Expected: 1 (single variable pattern)');
      console.log('[Faraz SMS] Params value type:', typeof params[patternVariableName], '- Value:', params[patternVariableName]);
      console.log('[Faraz SMS] Original sender number:', FARAZ_SMS_SENDER_NUMBER);
      console.log('[Faraz SMS] Processed sender number:', senderNumber);
      console.log('[Faraz SMS] From number (E.164):', fromNumberE164);
      console.log('[Faraz SMS] Recipient (E.164):', recipientE164);
      console.log('[Faraz SMS] Pattern Code:', FARAZ_SMS_PATTERN_CODE?.trim());
      console.log('[Faraz SMS] Using Pattern mode (Edge API)');
      console.log('[Faraz SMS] Full payload (for debugging):', JSON.stringify(payload, null, 2));

      try {
        // Edge API endpoint برای Pattern
        // بر اساس مستندات Edge API: https://edge.ippanel.com/v1/api/send
        const patternEndpoint = `${FARAZ_SMS_API_URL}/api/send`;
        console.log('[Faraz SMS] Sending Pattern request to:', patternEndpoint);
        console.log('[Faraz SMS] From number (E.164):', fromNumberE164);
        console.log('[Faraz SMS] Recipient (E.164):', recipientE164);
        
        const apiKey = FARAZ_SMS_API_KEY?.trim();
        
        // Authorization header طبق curl example پشتیبانی Faraz SMS
        // باید فقط API Key باشه (بدون "Bearer")
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // طبق curl example: --header 'Authorization: OWY1NWNlMWEtMzY4ZCNWE4N2VmMmFlOGFhNGRiZTE5NzU='
        // یعنی فقط API Key، بدون "Bearer"
        if (apiKey) {
          headers['Authorization'] = apiKey; // فقط API Key، بدون Bearer
        }
        
        console.log('[Faraz SMS] API Key for Authorization:', apiKey ? `${apiKey.substring(0, 10)}***` : 'NOT SET');
        console.log('[Faraz SMS] Authorization header value (API Key only, no Bearer):', headers['Authorization'] ? `${headers['Authorization'].substring(0, 20)}***` : 'NOT SET');
        console.log('[Faraz SMS] Request headers:', JSON.stringify({ 
          'Content-Type': headers['Content-Type'],
          'Authorization': headers['Authorization'] ? `${headers['Authorization'].substring(0, 20)}***` : 'NOT SET'
        }, null, 2));
        console.log('[Faraz SMS] Using API Key directly in Authorization header (per Faraz SMS support curl example)');
        
        const response = await axios.post(patternEndpoint, payload, { 
          timeout: 10000,
          headers,
        });
        
        console.log('[Faraz SMS] Pattern Response status:', response.status);
        console.log('[Faraz SMS] Pattern Response (raw):', response.data);
        console.log('[Faraz SMS] Pattern Response (type):', typeof response.data);
        console.log('[Faraz SMS] Pattern Response (stringified):', JSON.stringify(response.data, null, 2));
        
        const data = response.data;
        
        // اگر پاسخ string هست، بررسی می‌کنیم که آیا کد خطا هست
        if (typeof data === 'string') {
          const trimmed = data.trim();
          console.log('[Faraz SMS] Pattern Response (trimmed):', trimmed);
          console.log('[Faraz SMS] Pattern Response (length):', trimmed.length);
          console.log('[Faraz SMS] Pattern Response (char codes):', trimmed.split('').map(c => c.charCodeAt(0)).join(','));
          
          // اگر فقط عدد باشه، احتمالاً کد خطا هست
          if (/^\d+$/.test(trimmed)) {
            const errorCode = Number(trimmed);
            console.error('[Faraz SMS] Pattern Error Code detected:', errorCode);
            const errorMessage = getFarazErrorMessage(errorCode);
            return {
              success: false,
              error: errorMessage || `خطا از سرویس پیامکی: ${errorCode}`,
              providerResponse: data,
              errorCode,
            };
          }
          
          // اگر string شامل فاصله یا کاراکترهای خاص باشه، ممکنه چند کد خطا باشه
          const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
          console.log('[Faraz SMS] Pattern Response (parts):', parts);
          
          if (parts.length > 0 && /^\d+$/.test(parts[0])) {
            const errorCode = Number(parts[0]);
            console.error('[Faraz SMS] Pattern Error Code detected (first part):', errorCode);
            const errorMessage = getFarazErrorMessage(errorCode);
            return {
              success: false,
              error: errorMessage || `خطا از سرویس پیامکی: ${errorCode}`,
              providerResponse: data,
              errorCode,
            };
          }
        }
        
        // بررسی response قبل از handle
        if (data && typeof data === 'object' && data.meta && data.meta.status === false) {
          console.error('[Faraz SMS] Pattern API returned error:', data.meta);
          const errorCode = data.meta.message_code || data.meta.message;
          const errorMessage = data.meta.message || getFarazErrorMessage(errorCode) || 'خطا از سرویس پیامکی';
          return {
            success: false,
            error: errorMessage,
            providerResponse: data,
            errorCode,
          };
        }
        
        return handleFarazResponse(data);
      } catch (error) {
        console.error('[Faraz SMS] Pattern Request Exception:', error.message);
        console.error('[Faraz SMS] Pattern Request Error Response:', error?.response?.data);
        console.error('[Faraz SMS] Pattern Request Error Status:', error?.response?.status);
        console.error('[Faraz SMS] Pattern Request Error Headers:', error?.response?.headers);
        
        // اگر response data داره، بررسی می‌کنیم
        if (error?.response?.data) {
          const responseData = error.response.data;
          if (responseData.meta && responseData.meta.status === false) {
            const errorCode = responseData.meta.message_code || responseData.meta.message;
            const errorMessage = responseData.meta.message || getFarazErrorMessage(errorCode) || 'خطا از سرویس پیامکی';
            return {
              success: false,
              error: errorMessage,
              providerResponse: responseData,
              errorCode,
            };
          }
        }
        
        return {
          success: false,
          error: error?.response?.data?.message || error.message || 'خطای ناشناخته در ارسال پیامک',
          providerResponse: error?.response?.data,
        };
      }
    }

    const payload = {
      op: 'send',
      uname: FARAZ_SMS_USERNAME?.trim(),
      pass: FARAZ_SMS_PASSWORD?.trim(),
      message,
      from: FARAZ_SMS_SENDER_NUMBER?.trim(),
      to: [phone],
    };

    console.log('[Faraz SMS] Using Direct Send mode');
    console.log('[Faraz SMS] Sending request to:', FARAZ_SMS_API_URL);
    console.log('[Faraz SMS] Payload (sanitized):', JSON.stringify({ 
      ...payload, 
      uname: payload.uname ? `${payload.uname.substring(0, 3)}***` : 'NOT SET',
      pass: '***',
      from: payload.from,
      to: payload.to,
      message: payload.message?.substring(0, 50) + '...'
    }, null, 2));

    const { data } = await axios.post(FARAZ_SMS_API_URL, payload, { timeout: 10000 });
    
    console.log('[Faraz SMS] Raw response:', JSON.stringify(data, null, 2));
    
    const result = handleFarazResponse(data);
    console.log('[Faraz SMS] Processed result:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('[Faraz SMS] Exception occurred:', error.message);
    console.error('[Faraz SMS] Response data:', error?.response?.data);
    console.error('[Faraz SMS] Response status:', error?.response?.status);
    return {
      success: false,
      error: error?.response?.data?.message || error.message || 'خطای ناشناخته در ارسال پیامک',
      providerResponse: error?.response?.data,
    };
  }
};

const handleFarazResponse = (data) => {
  console.log('[Faraz SMS] Handling response, data type:', typeof data, 'isArray:', Array.isArray(data));
  console.log('[Faraz SMS] Full response data:', JSON.stringify(data, null, 2));
  
  if (!data) {
    console.error('[Faraz SMS] Empty response');
    return { success: false, error: 'پاسخ نامعتبر از سرویس پیامکی' };
  }

  // اگر پاسخ string باشه، سعی می‌کنیم parse کنیم
  if (typeof data === 'string') {
    console.log('[Faraz SMS] Response is string, attempting to parse...');
    try {
      // سعی می‌کنیم به عنوان JSON parse کنیم
      const parsed = JSON.parse(data);
      console.log('[Faraz SMS] Parsed string to:', typeof parsed, parsed);
      return handleFarazResponse(parsed);
    } catch (e) {
      // اگر JSON نبود، بررسی می‌کنیم که آیا یک عدد هست (کد خطا)
      const trimmed = data.trim();
      console.log('[Faraz SMS] String response (not JSON):', trimmed);
      
      // اگر فقط عدد باشه، احتمالاً کد خطا هست
      if (/^\d+$/.test(trimmed)) {
        const errorCode = Number(trimmed);
        const errorMessage = getFarazErrorMessage(errorCode);
        console.error('[Faraz SMS] Error code detected:', errorCode, '-', errorMessage);
        return {
          success: false,
          error: errorMessage || `خطا از سرویس پیامکی: ${errorCode}`,
          providerResponse: data,
          errorCode,
        };
      }
      
      // اگر string خالی یا فقط فاصله باشه، احتمالاً خطا هست
      if (trimmed.length === 0) {
        console.error('[Faraz SMS] Empty string response');
        return { success: false, error: 'پاسخ خالی از سرویس پیامکی', providerResponse: data };
      }
      
      // اگر string شامل "0" یا "success" باشه، احتمالاً موفقیت هست
      if (trimmed === '0' || trimmed.toLowerCase().includes('success')) {
        console.log('[Faraz SMS] Success detected in string response');
        return { success: true, providerResponse: data };
      }
    }
  }

  // Faraz SMS returns [0, messageId] for success
  if (Array.isArray(data)) {
    console.log('[Faraz SMS] Response is array, first element:', data[0], 'type:', typeof data[0]);
    if (String(data[0]) === '0' || Number(data[0]) === 0) {
      console.log('[Faraz SMS] Success detected (array with 0)');
      return { success: true, providerResponse: data };
    } else {
      const errorCode = data[0];
      const errorMessage = getFarazErrorMessage(errorCode);
      console.error('[Faraz SMS] Error detected (array with non-zero):', errorCode, '-', errorMessage);
      return {
        success: false,
        error: errorMessage || `خطا از سرویس پیامکی: ${errorCode}`,
        providerResponse: data,
        errorCode,
      };
    }
  }

  if (typeof data === 'object' && data?.status === 'success') {
    console.log('[Faraz SMS] Success detected (object with status success)');
    return { success: true, providerResponse: data };
  }

  // بررسی object با فیلدهای مختلف
  if (typeof data === 'object' && data !== null) {
    // بررسی فرمت جدید Edge API (با meta و data)
    if (data.meta) {
      console.log('[Faraz SMS] Edge API response format detected');
      console.log('[Faraz SMS] Meta status:', data.meta.status);
      console.log('[Faraz SMS] Meta message:', data.meta.message);
      console.log('[Faraz SMS] Meta message_code:', data.meta.message_code);
      
      if (data.meta.status === true || data.meta.status === 'true') {
        console.log('[Faraz SMS] Success detected (Edge API format)');
        return { success: true, providerResponse: data };
      }
      
      // اگر status false باشه، خطا هست
      if (data.meta.status === false || data.meta.status === 'false') {
        const errorCode = data.meta.message_code || data.meta.message;
        const errorMessage = data.meta.message || getFarazErrorMessage(errorCode) || 'خطا از سرویس پیامکی';
        console.error('[Faraz SMS] Error detected (Edge API format):', errorCode, '-', errorMessage);
        
        // بررسی errors array اگر وجود داشته باشه
        if (data.meta.errors) {
          console.error('[Faraz SMS] Errors details:', JSON.stringify(data.meta.errors, null, 2));
        }
        
        return {
          success: false,
          error: errorMessage,
          providerResponse: data,
          errorCode,
        };
      }
    }
    
    // اگر فیلد status یا success وجود داشته باشه
    if (data.status === 'success' || data.success === true) {
      console.log('[Faraz SMS] Success detected (object with status/success field)');
      return { success: true, providerResponse: data };
    }
    
    // اگر فیلد error یا message وجود داشته باشه
    if (data.error || data.message) {
      console.error('[Faraz SMS] Error detected in object:', data.error || data.message);
      return {
        success: false,
        error: data.error || data.message || 'خطا از سرویس پیامکی',
        providerResponse: data,
      };
    }
  }

  console.error('[Faraz SMS] Unknown response format or error');
  return {
    success: false,
    error: data?.message || 'ارسال پیامک با خطا مواجه شد',
    providerResponse: data,
  };
};

// Faraz SMS Error Codes
const getFarazErrorMessage = (errorCode) => {
  const errorMessages = {
    0: 'موفق',
    1: 'نام کاربری یا رمز عبور اشتباه است',
    2: 'اعتبار کافی نیست',
    3: 'محدودیت در ارسال روزانه',
    4: 'محدودیت در ارسال ساعتی',
    5: 'شماره گیرنده معتبر نیست',
    6: 'متن پیامک خالی است',
    7: 'متن پیامک بیش از حد مجاز است',
    8: 'شماره سرشماره معتبر نیست',
    9: 'خطای نامشخص',
    10: 'محدودیت در ارسال به این شماره',
    11: 'محدودیت در ارسال به این اپراتور',
    12: 'محدودیت در ارسال به این استان',
    13: 'محدودیت در ارسال به این شهر',
    14: 'محدودیت در ارسال به این کدپستی',
    15: 'محدودیت در ارسال به این IP',
    16: 'محدودیت در ارسال به این دامنه',
    17: 'محدودیت در ارسال به این URL',
    18: 'محدودیت در ارسال به این کلمه کلیدی',
    19: 'محدودیت در ارسال به این الگو',
    20: 'محدودیت در ارسال به این زمان',
    21: 'محدودیت در ارسال به این تاریخ',
    22: 'محدودیت در ارسال به این ماه',
    23: 'محدودیت در ارسال به این سال',
    24: 'محدودیت در ارسال به این کاربر',
    25: 'محدودیت در ارسال به این گروه',
    26: 'محدودیت در ارسال به این لیست',
    27: 'محدودیت در ارسال به این تمپلیت',
    28: 'محدودیت در ارسال به این سرویس',
    29: 'محدودیت در ارسال به این پکیج',
    30: 'محدودیت در ارسال به این کمپین',
    962: 'شماره سرشماره معتبر نیست یا با Pattern Code همخوانی ندارد. لطفاً در پنل Faraz SMS بررسی کنید که شماره سرشماره فعال است و اگر از Pattern استفاده می‌کنید، Pattern Code با شماره سرشماره همخوانی دارد.',
    '400-2': 'خطا در Pattern Code یا شماره سرشماره. لطفاً در پنل Faraz SMS بررسی کنید که Pattern Code با شماره سرشماره همخوانی دارد و متغیر OTP به درستی تنظیم شده است.',
  };

  // اگر errorCode string باشه (مثل '400-2')
  if (typeof errorCode === 'string') {
    return errorMessages[errorCode] || `خطای ناشناخته: ${errorCode}`;
  }

  return errorMessages[errorCode] || `خطای ناشناخته: ${errorCode}`;
};

/**
 * ارسال پیامک تایید خرید (استفاده از Pattern)
 * @param {string} phone - شماره موبایل مشتری
 * @param {object} orderData - اطلاعات سفارش شامل orderNumber, trackingCode, amount
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendOrderConfirmationSms = async (phone, orderData) => {
  console.log('[Faraz SMS] Starting Order Confirmation SMS send request');
  console.log('[Faraz SMS] Phone:', phone);
  console.log('[Faraz SMS] Order Data:', orderData);
  console.log('[Faraz SMS] Sender:', FARAZ_SMS_SENDER_NUMBER);
  
  // بررسی تنظیمات
  const ORDER_PATTERN_CODE = process.env.FARAZ_SMS_ORDER_PATTERN_CODE?.trim();
  const ORDER_PATTERN_VARS = process.env.FARAZ_SMS_ORDER_PATTERN_VARIABLE_NAMES?.split(',').map(v => v.trim()) || [];
  
  if (!FARAZ_SMS_API_KEY || !FARAZ_SMS_SENDER_NUMBER) {
    console.error('[Faraz SMS] Missing API Key or Sender Number');
    return { 
      success: false, 
      error: 'تنظیمات پنل پیامکی کامل نیست (API Key یا شماره سرشماره تنظیم نشده)' 
    };
  }
  
  if (!ORDER_PATTERN_CODE) {
    console.error('[Faraz SMS] Order Pattern Code not set');
    return { 
      success: false, 
      error: 'Pattern Code برای تایید خرید تنظیم نشده است (FARAZ_SMS_ORDER_PATTERN_CODE)' 
    };
  }

  try {
    // تبدیل شماره موبایل به فرمت بدون 0 اول
    const phoneForPattern = phone.startsWith('0') ? phone.slice(1) : phone;
    
    // تبدیل شماره سرشماره به فرمت E.164
    let senderNumber = FARAZ_SMS_SENDER_NUMBER?.trim() || '';
    if (senderNumber.startsWith('0')) {
      senderNumber = senderNumber.slice(1);
    }
    const fromNumberE164 = `+98${senderNumber}`;
    const recipientE164 = `+98${phoneForPattern}`;
    
    // ساخت params برای Pattern
    // استفاده از نام‌های واقعی Pattern که در .env تعریف شده‌اند (با همان case)
    // اگر در .env تعریف نشده باشند، از نام‌های پیش‌فرض استفاده می‌کنیم
    // ⚠️ مهم: نام‌های پیش‌فرض باید دقیقاً با Pattern در پنل Faraz SMS یکسان باشند
    const defaultVarNames = ['order_number', 'tracking_code', 'amount']; // با حروف کوچک و underscore
    const varNames = ORDER_PATTERN_VARS.length > 0 ? ORDER_PATTERN_VARS : defaultVarNames;
    
    const params = {};
    
    // اگر نام متغیرها در .env تعریف شده باشند، از همان نام‌ها استفاده می‌کنیم (با همان case)
    // در غیر این صورت از نام‌های پیش‌فرض استفاده می‌کنیم
    
    // متغیر اول: شماره سفارش
    const orderNumberVarName = varNames[0] || 'order_number';
    params[orderNumberVarName] = orderData.orderNumber || orderData.order_number || 'نامشخص';
    
    // متغیر دوم: کد رهگیری
    const trackingCodeVarName = varNames[1] || 'tracking_code';
    params[trackingCodeVarName] = orderData.trackingCode || orderData.payment_ref_id || 'نامشخص';
    
    // متغیر سوم: مبلغ
    // ⚠️ مهم: amount باید به صورت عدد ارسال شود (نه رشته فرمت شده)
    // چون در پترن فراز اس ام اس به عنوان "عدد" تعریف شده است
    const amountVarName = varNames[2] || 'amount';
    const amountValue = orderData.amount || orderData.total_amount || 0;
    // تبدیل به عدد صحیح (integer) - نه رشته فرمت شده
    params[amountVarName] = Math.round(Number(amountValue));
    
    console.log('[Faraz SMS] Pattern variable names (exact case from .env or default):', varNames);
    console.log('[Faraz SMS] Using variable names:', {
      orderNumber: orderNumberVarName,
      trackingCode: trackingCodeVarName,
      amount: amountVarName
    });
    
    // Payload برای Edge API Pattern
    const payload = {
      sending_type: 'pattern',
      from_number: fromNumberE164,
      code: ORDER_PATTERN_CODE,
      recipients: [recipientE164],
      params: params,
    };
    
    console.log('[Faraz SMS] Using Pattern mode for Order Confirmation');
    console.log('[Faraz SMS] Pattern Code:', ORDER_PATTERN_CODE);
    console.log('[Faraz SMS] Pattern Variables:', JSON.stringify(params, null, 2));
    console.log('[Faraz SMS] From number (E.164):', fromNumberE164);
    console.log('[Faraz SMS] Recipient (E.164):', recipientE164);
    console.log('[Faraz SMS] Full payload:', JSON.stringify(payload, null, 2));
    
    const apiKey = FARAZ_SMS_API_KEY?.trim();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': apiKey, // فقط API Key، بدون Bearer
    };
    
    console.log('[Faraz SMS] API Key for Authorization:', apiKey ? `${apiKey.substring(0, 10)}***` : 'NOT SET');
    
    const response = await axios.post(
      `${FARAZ_SMS_API_URL}/api/send`,
      payload,
      {
        headers: headers,
        timeout: 10000,
      }
    );
    
    console.log('[Faraz SMS] Order Confirmation Pattern Response status:', response.status);
    console.log('[Faraz SMS] Order Confirmation Pattern Response data:', JSON.stringify(response.data, null, 2));
    console.log('[Faraz SMS] 🚨 FULL RESPONSE FOR DEBUGGING:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      meta: response.data?.meta,
      errors: response.data?.errors,
      message_code: response.data?.meta?.message_code,
      message: response.data?.meta?.message
    });
    
    // بررسی پاسخ
    if (response.data && response.data.meta) {
      const { code, message: responseMessage, status, message_code } = response.data.meta;
      
      console.log('[Faraz SMS] 📊 Response Analysis:', {
        status: status,
        code: code,
        message_code: message_code,
        message: responseMessage,
        isSuccess: status === true || code === 200 || code === 0 || message_code === '200-1'
      });
      
      if (status === true || code === 200 || code === 0 || message_code === '200-1') {
        console.log('[Faraz SMS] ✅ Order Confirmation SMS sent successfully via Pattern');
        return {
          success: true,
          messageId: response.data.data?.message_id,
          providerResponse: response.data,
        };
      } else {
        const errorMessage = getFarazErrorMessage(code || message_code) || responseMessage || `خطا از سرویس پیامکی: ${code || message_code}`;
        console.error('[Faraz SMS] ❌ Order Confirmation SMS failed:', errorMessage);
        console.error('[Faraz SMS] ❌ Full error details:', JSON.stringify(response.data, null, 2));
        return {
          success: false,
          error: errorMessage,
          errorCode: code || message_code,
          providerResponse: response.data,
        };
      }
    }
    
    // اگر فرمت پاسخ متفاوت بود
    return handleFarazResponse(response.data);
  } catch (error) {
    console.error('[Faraz SMS] 🚨 EXCEPTION in Order Confirmation SMS:', error.message);
    console.error('[Faraz SMS] Error response:', error?.response?.data);
    console.error('[Faraz SMS] Error status:', error?.response?.status);
    console.error('[Faraz SMS] Error headers:', error?.response?.headers);
    console.error('[Faraz SMS] Full error object:', JSON.stringify({
      message: error.message,
      stack: error.stack,
      response: {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        headers: error?.response?.headers
      }
    }, null, 2));
    
    return {
      success: false,
      error: error?.response?.data?.message || error?.response?.data?.meta?.message || error.message || 'خطای ناشناخته در ارسال پیامک',
      errorCode: error?.response?.data?.meta?.message_code || error?.response?.status,
      providerResponse: error?.response?.data,
    };
  }
};


