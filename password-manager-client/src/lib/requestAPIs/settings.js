import sendReq from "./_common/sendReq";

const settings = {
  get: {
    data: async () => {
      return await sendReq("/home/settings", "GET");
    },
  },

  put: {
    password: async (oldPassword, newPassword) => {
      return await sendReq("/home/settings/new-password", "POST", {
        oldPassword,
        newPassword,
      });
    },

    email: async (oldEmail, password, newEmail) => {
      return await sendReq("/home/settings/new-email", "POST", {
        oldEmail,
        password,
        newEmail,
      });
    },
  },

  delete: {
    account: async (email, password) => {
      return await sendReq("/home/settings/delete-account", "POST", {
        email,
        password,
      });
    },
  },
};

export default settings;
