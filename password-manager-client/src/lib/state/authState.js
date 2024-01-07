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

const pendingAuthCheckStore = create_pendingAuthCheckStore(),
  authStateStore = create_localAuthStateStore();

//common interface for fetching the auth state of the user,
//which depends on httpOnly cookies being checked in the req
//object on the server.

//this promise resolves as a simple boolean, true meaning the user is
//properly authed, and false if not
const requestAuthState = async () => {
  const res = await fetch("/auth-state"),
    parsedRes = await res.json();

  const authBool = parsedRes.auth;

  return authBool;
};

const checkAuth = async () => {
  pendingAuthCheckStore.pendingTrue();

  try {
    const authStateBool = await requestAuthState();

    if (authStateBool) {
      authStateStore.authedTrue();
    } else {
      authStateStore.authedFalse();
    }
  } catch (error) {
    // Handle the error (likely including an auth error state)
    console.log("checkAuth Request Error", error, error.stack);
    authStateStore.authedFalse();
  } finally {
    pendingAuthCheckStore.pendingFalse();
  }
};

export { pendingAuthCheckStore, authStateStore, requestAuthState, checkAuth };
