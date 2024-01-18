import {
  authStateStore,
  redirectToHomeStore,
  currAuthCensoredEmailStore,
} from "./state/authState";

async function sendFormReq(route, payload) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const res = await fetch(route, config),
    parsedRes = await res.json();

  return parsedRes;
}

async function handleLoginRequest(email, password) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let result, error;

  try {
    result = await sendFormReq("/log-in", { email, password });
  } catch (err) {
    error = err;
  }

  //error with the request promise itself
  if (error) {
    console.error(`handleLoginRequest error`, error, error.stack);

    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
    redirectToHomeStore.false();

    return error;
  }

  //some type of internal error occured on the server
  if (!result.success && result.error) {
    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
    redirectToHomeStore.false();

    return result.error;
  }

  //means the user is already authed
  //or that the user successfully logged in
  //SHORT CIRCUITED CONDITION
  if (result.success || (!result.success && result.auth)) {
    authStateStore.authedTrue();
    currAuthCensoredEmailStore.setEmail(result.email);
    redirectToHomeStore.true();
  }
}

async function handleSignupRequest(email, password, confirmPassword) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let result, error;

  try {
    result = await sendFormReq("/sign-up", {
      email,
      password,
      confirmPassword,
    });
  } catch (err) {
    error = err;
  }

  //some type of error occurred from the client side
  if (error) {
    console.error(`handleSignupRequest error`, error, error.stack);

    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
    redirectToHomeStore.false();

    return error;
  }

  //some type of internal error occured on the server
  if (!result.success && result.error) {
    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
    redirectToHomeStore.false();

    return result.error;
  }

  //means the user is already authed
  //or that the user successfully signed up
  //SHORT CIRCUITED CONDITION
  if (result.success || (!result.success && result.auth)) {
    authStateStore.authedTrue();
    currAuthCensoredEmailStore.setEmail(result.email);
    redirectToHomeStore.true();
  }
}

export { handleLoginRequest, handleSignupRequest };
