/**
 * Formats numeric input into DD/MM/YYYY structure in real-time.
 * Automatically handles slashes and limits to 8 digits total.
 */
export const formatDate = (value: string): string => {
  // 1. Strip all non-numeric characters
  let cleaned = value.replace(/\D/g, '');

  // 2. Strictly enforce max 8 digits
  cleaned = cleaned.substring(0, 8);

  // 3. Inject slashes based on length
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }
};

/**
 * Strips all non-numeric characters and enforces a 10-digit limit for mobile numbers.
 */
export const formatMobile = (value: string): string => {
  return value.replace(/\D/g, '').substring(0, 10);
};

export const formatAadhaar = (value: string): string => {
  return value.replace(/\D/g, '');
};