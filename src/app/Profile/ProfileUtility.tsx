export const passwordStrength = (password: string) => {
  let result = 0;

  if (/[A-Z]/.test(password)) {
    // has uppercase
    result += 1;
  }
  if (/[a-z]/.test(password)) {
    // has lowercase letter
    result += 1;
  }
  if (/[0-9]/.test(password)) {
    // has number
    result += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    // has special character
    result += 1;
  }
  if (password.length > 7) {
    // length is greater than 7
    result += 1;
  }

  return result;
};
