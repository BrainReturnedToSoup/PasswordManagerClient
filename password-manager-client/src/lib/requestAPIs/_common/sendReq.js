async function sendReq(route, method, payload) {
  const config = {
    method,
  };

  if (payload) {
    config.headers = {
      "Content-Type": "application/json",
    };
    config.body = JSON.stringify(payload);
  }

  try {
    const res = await fetch(route, config),
      parsedRes = await res.json();

    return parsedRes;
  } catch (error) {
    return { success: false, error };
  }
}

export default sendReq;
