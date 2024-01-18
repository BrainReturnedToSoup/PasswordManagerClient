function validateEmail(email) {
  if (!email) {
    return "";
  } //for upon app start up validation

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    isValidEmail = emailPattern.test(email);

  if (!isValidEmail) {
    return `Email is invalid`;
  }

  return ""; //blank string means valid
}

function validatePassword(password) {
  if (!password) {
    return "";
  }

  if (password.length < 12) {
    return "Password is too small. Must be between 12 and 20 characters";
  }

  if (password.length > 20) {
    return "Password is too large. Must be between 12 and 20 characters";
  }

  const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    isValidPassword = passwordPattern.test(password);

  if (!isValidPassword) {
    return `Password is invalid. Must adhere to the following rules;
     Atleast one uppercase and lowercase letter, atleast one digit,
      atleast one special character, and only letters, digits, and specialized characters`;
  }

  return "";
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) {
    return "";
  }

  if (confirmPassword !== password) {
    return `Confirm password does not match password`;
  }

  return "";
}

export { validateEmail, validatePassword, validateConfirmPassword };
