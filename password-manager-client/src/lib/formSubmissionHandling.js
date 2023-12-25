async function sendLoginRequest(email, password) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  const config = {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  //fetch request sends the log in info, and then sends a response
  //to dictate client behavior. This is either a good request or a request
  //that expresses an error flag with a message
  const res = await fetch("/log-in", config),
    parsedRes = await res.json();

  return parsedRes;
}

async function sendSignupRequest(email, password, confirmPassword) {
  //USE BODY PARSER MIDDLEWARE ON SERVER

  const config = {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  };

  //fetch request sends the sign up info, and then sends a response
  //to dictate client behavior. This returns either a good response or a response
  //that expresses an error flag with a message
  const res = await fetch("/sign-up", config),
    parsedRes = await res.json();

  return parsedRes;
}

export { sendLoginRequest, sendSignupRequest };
