const IRAN_PHONE_REGEX = /^(?:\+98|0098|98|0)?9\d{9}$/;

export const normalizeIranPhoneNumber = (phone) => {
  if (!phone) {
    return null;
  }

  const digits = String(phone).replace(/[^\d+]/g, '');

  if (!IRAN_PHONE_REGEX.test(digits)) {
    return null;
  }

  if (digits.startsWith('+98')) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith('0098')) {
    return `0${digits.slice(4)}`;
  }

  if (digits.startsWith('98')) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith('9') && digits.length === 10) {
    return `0${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 11) {
    return digits;
  }

  return null;
};


