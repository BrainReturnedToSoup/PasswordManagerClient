import {
  authStateStore,
  onFormAuthRedirectStore,
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

  let parsedRes, error;

  try {
    parsedRes = await sendFormReq("/log-in", { email, password });
  } catch (err) {
    error = err;
  }

  //error with the request promise itself
  if (error) {
    console.error(`handleLoginRequest error`, error, error.stack);
  }

  //error flag
  if (parsedRes.error) {
    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    onFormAuthRedirectStore.false();

    return parsedRes.error; //should contain some sort of server error message
  }

  if (parsedRes.auth) {
    authStateStore.authedTrue();
    currAuthEmailCensoredStore.setEmail(parsedRes.email);
    onFormAuthRedirectStore.true();
  }
}

async function handleSignupRequest(email, password, confirmPassword) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let parsedRes, error;

  try {
    parsedRes = await sendFormReq("/sign-up", {
      email,
      password,
      confirmPassword,
    });
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`handleSignupRequest error`, error, error.stack);
  }

  if (parsedRes.error) {
    authStateStore.authedFalse();
    currAuthEmailCensoredStore.clearEmail();
    onFormAuthRedirectStore.false();

    return parsedRes.error;
  }

  if (parsedRes.auth) {
    authStateStore.authedTrue();
    currAuthEmailCensoredStore.setEmail(parsedRes.email);
    onFormAuthRedirectStore.true();
  }
}

export { handleLoginRequest, handleSignupRequest };
