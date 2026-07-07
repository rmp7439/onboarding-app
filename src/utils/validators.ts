export const validateMobile = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validateAadhaar = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar);
};

export const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

export const validateIFSC = (ifsc: string): boolean => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

export const validatePinCode = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
};

export const validateDate = (date: string): boolean => {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
};