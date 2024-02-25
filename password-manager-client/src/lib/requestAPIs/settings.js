import sendReq from "./_common/sendReq";

const settings = {
  get: {
    data: async () => {
      return await sendReq("/home/settings", "GET");
    }, //for retrieving all of the relevant settings data for the session, particularly preferences as well misc such as the verified email flag
  },

  put: {
    password: async (oldPassword, newPassword) => {
      return await sendReq("/home/settings/password", "PUT", {
        oldPassword,
        newPassword,
      });
    }, //for updating the password associated with the session

    email: async (oldEmail, password, newEmail) => {
      return await sendReq("/home/settings/email", "PUT", {
        oldEmail,
        password,
        newEmail,
      });
    }, //for updating the email associated with the session
  },

  delete: {
    account: async (email, password) => {
      return await sendReq("/home/settings/account", "DELETE", {
        email,
        password,
      });
    }, //for deleting the account associated with the session
  },

  verifyEmail: {
    post: async () => {
      return await sendReq("/home/settings/verify-email", "POST");
    }, //for init of email verification process. Includes code creation and email sent with code.

    put: async (code) => {
      return await sendReq("/home/settings/verify-email", "PUT", { code });
    }, //for verifying the email associated with a session using the code sent to their email.
  },
};

export default settings;
