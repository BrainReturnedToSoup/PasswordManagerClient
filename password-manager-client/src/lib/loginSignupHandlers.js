import {
  authStateStore,
  redirectToHomeStore,
  currAuthEmailCensoredStore,
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

  let loginResult, error;

  try {
    loginResult = await sendFormReq("/log-in", { email, password });
  } catch (err) {
    error = err;
  }

  //error with the request promise itself
  if (error) {
    console.error(`handleLoginRequest error`, error, error.stack);

    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    redirectToHomeStore.false();
  }

  if (loginResult.error) {
    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    redirectToHomeStore.false();
    return loginResult.error; //take the error value and display such on the UI
  }

  if (loginResult.success) {
    authStateStore.authedTrue();
    currAuthEmailCensoredStore.setEmail(loginResult.email);
    redirectToHomeStore.true();
  }
}

async function handleSignupRequest(email, password, confirmPassword) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let signupResult, error;

  try {
    signupResult = await sendFormReq("/sign-up", {
      email,
      password,
      confirmPassword,
    });
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`handleSignupRequest error`, error, error.stack);

    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    redirectToHomeStore.false();
  }

  if (signupResult.error) {
    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    redirectToHomeStore.false();
    return signupResult.error; //take the error value and display such on the UI
  }

  if (signupResult.success) {
    authStateStore.authedTrue();
    currAuthEmailCensoredStore.setEmail(signupResult.email);
    redirectToHomeStore.true();
  }
}

export { handleLoginRequest, handleSignupRequest };
