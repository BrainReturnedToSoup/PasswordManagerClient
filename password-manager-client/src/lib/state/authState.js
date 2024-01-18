import { writable } from "svelte/store";

//used to keep track of whether the app has made a request to check the current
//auth status of the user. This is important for determining routing behaviors.

//for specific conditions such as for creating conditional loading screens
//while the auth state promise is pending
const create_pendingAuthCheckStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    pendingTrue: () => {
      set(true);
    },
    pendingFalse: () => {
      set(false);
    },
    reset: () => {
      set(false);
    },
  };
};

//for direct routing purposes
const create_localAuthStateStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    authedTrue: () => {
      set(true);
    },
    authedFalse: () => {
      set(false);
    },
    reset: () => {
      set(false);
    },
  };
};

const create_currAuthCensoredEmailStore = () => {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    //for the already censored email in a auth-related response,
    //which includes form submissions and general auth checks
    setEmail: (censoredEmail) => {
      set(censoredEmail);
    },
    clearEmail: () => {
      set("");
    },
  };
};

const create_redirectToHomeStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    true: () => {
      set(true);
    },
    false: () => {
      set(false);
    },
  };
};

const create_redirectToLoginStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    true: () => {
      set(true);
    },
    false: () => {
      set(false);
    },
  };
};

const pendingAuthCheckStore = create_pendingAuthCheckStore(),
  authStateStore = create_localAuthStateStore(),
  currAuthCensoredEmailStore = create_currAuthCensoredEmailStore();

const redirectToHomeStore = create_redirectToHomeStore(), //for preventing redundant auth check request on the home page if authed through login/signup
  redirectToLoginStore = create_redirectToLoginStore(); //for preventing redundant auth check request on the login page based on a logout redirect

//common interface for fetching the auth state of the user,
//which depends on httpOnly cookies being checked in the req
//object on the server.

//this promise resolves as a simple boolean, true meaning the user is
//properly authed, and false if not
const requestAuthState = async () => {
  const res = await fetch("/auth-state"),
    parsedRes = await res.json();

  return parsedRes;
};

const checkAuth = async () => {
  pendingAuthCheckStore.pendingTrue();

  let result, error;

  try {
    result = await requestAuthState();
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error("checkAuth Request Error", error, error.stack);
    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
  }

  if (result.success && result.auth) {
    authStateStore.authedTrue();
    currAuthCensoredEmailStore.setEmail(result.email); //for the profile UI feature on the home page
  } else {
    authStateStore.authedFalse();
    currAuthCensoredEmailStore.clearEmail();
  }

  pendingAuthCheckStore.pendingFalse();
};

export {
  pendingAuthCheckStore,
  authStateStore,
  currAuthCensoredEmailStore,
  redirectToHomeStore,
  redirectToLoginStore,
  requestAuthState,
  checkAuth,
};
