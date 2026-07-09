/**
 * Strips all non-numeric characters and enforces a 10-digit limit for mobile numbers.
 */
export const formatMobile = (value: string): string => {
  return value.replace(/\D/g, '').substring(0, 10);
};