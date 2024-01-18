import {
  authStateStore,
  redirectToLoginStore,
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

async function handleDeleteAccount(email, password) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let result, error;

  try {
    result = await sendFormReq("/home/settings/delete-account", {
      email,
      password,
    });
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`handleDeleteAccount catch block: `, error, error.stack);
    return error;
  }

  if (!result.success) {
    //if the user was not authed when submitting the request
    if ("auth" in result && !result.auth) {
      const fourSeconds = 4000;

      setTimeout(() => {
        currAuthCensoredEmailStore.clearEmail();
        redirectToLoginStore.true();
        authStateStore.authedFalse();
      }, fourSeconds); // a delayed redirect to the login page, alerting the user of their auth status first.

      return "Session expired, please log-in and attempt again";
    }

    return result.error;
  }

  if (result.success) {
    currAuthCensoredEmailStore.clearEmail();
    redirectToLoginStore.true();
    authStateStore.authedFalse();
  }
}

async function handleNewPassword(oldPassword, newPassword) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  let result, error;

  try {
    result = await sendFormReq("/home/settings/new-password", {
      oldPassword,
      newPassword,
    });
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`handleNewPassword catch block: `, error, error.stack);
    return error;
  }

  if (!result.success) {
    //if the user was not authed when submitting the request
    if ("auth" in result && !result.auth) {
      const fourSeconds = 4000;

      setTimeout(() => {
        currAuthCensoredEmailStore.clearEmail();
        redirectToLoginStore.true();
        authStateStore.authedFalse();
      }, fourSeconds); // a delayed redirect to the login page, alerting the user of their auth status first.

      return "Session expired, please log-in and attempt again";
    }

    return result.error;
  }

  if (result.success) {
    currAuthCensoredEmailStore.clearEmail();
    redirectToLoginStore.true();
    authStateStore.authedFalse();
  }
}

export { handleDeleteAccount, handleNewPassword };
