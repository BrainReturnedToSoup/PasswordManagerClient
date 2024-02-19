import sendReq from "./_common/sendReq";

const credentials = {
  get: {
    credentials: async (credentialID) => {
      return await sendReq(
        `/home/credentials?credentialID=${credentialID}`,
        "GET"
      );
    },

    description: async (credentialID) => {
      return await sendReq(
        `/home/credentials/description?credentialID=${credentialID}`,
        "GET"
      );
    },

    emailUsername: async (credentialID) => {
      return await sendReq(
        `/home/credentials/email-username?credentialID=${credentialID}`,
        "GET"
      );
    },

    password: async (credentialID) => {
      return await sendReq(
        `/home/credentials/password?credentialID=${credentialID}`
      );
    },

    idAndNameSet: async () => {
      return await sendReq("/home/credentials/id-name-set");
    },
  },

  post: {
    credential: async (name, emailUsername, password, description) => {
      return await sendReq("/home/credentials", "POST", {
        name,
        emailUsername,
        password,
        description,
      });
    },
  },

  put: {
    credential: async (credentialID, payload) => {
      return await sendReq(
        `/home/credentials?credentialID=${credentialID}`,
        "PUT",
        { ...payload, credentialID }
      );
    },
  },

  delete: {
    credential: async (credentialID) => {
      return await sendReq(
        `/home/credentials?credentialID=${credentialID}`,
        "DELETE"
      );
    },
  },
};

export default credentials;
