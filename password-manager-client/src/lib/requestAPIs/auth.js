import sendReq from "./_common/sendReq";

const auth = {
  get: {
    check: async () => {
      return await sendReq("/auth-state", "GET");
    },
  },

  post: {
    login: async (email, password) => {
      return await sendReq("/log-in", "POST", { email, password });
    },

    signup: async (email, password) => {
      return await sendReq("/sign-up", "POST", {
        email,
        password,
      });
    },

    logout: async () => {
      return await sendReq("/home/log-out", "POST");
    },
  },
};

export default auth;
