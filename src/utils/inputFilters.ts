/**
 * Evaluates if the input contains ONLY letters and spaces.
 * Returns true if valid, false if it contains numbers, symbols, etc.
 */
export const isValidNameInput = (value: string): boolean => {
  return /^[A-Za-z ]*$/.test(value);
};

// ... keep other existing filters if used elsewhere ...
export const allowOnlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const allowAlphaNumeric = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

export const allowAddressCharacters = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\s,.-/]/g, '');
};