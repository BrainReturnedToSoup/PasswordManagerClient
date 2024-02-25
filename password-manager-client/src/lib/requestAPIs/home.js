import sendReq from "./_common/sendReq";

const home = {
  get: {
    email: async () => {
      return sendReq("/home/email", "GET");
    },
  },
};

export default home;
