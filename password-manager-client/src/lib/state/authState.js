import { writable } from "svelte/store";

//used to keep track of whether the app has made a request to check the current
//auth status of the user. This is important for determining routing behaviors.

//a flag used to help determine when to send out
//future auth state checks. Upon receiving the app
//this is immediately checked, but perhaps such may
//be checked when navigating through the routes
const create_firstAuthCheckStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    checkTrue: () => {
      set(true);
    },
    checkFalse: () => {
      set(false);
    },
    reset: () => {
      set(false);
    },
  };
};

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

const firstAuthCheckStore = create_firstAuthCheckStore(),
  pendingAuthCheckStore = create_pendingAuthCheckStore(),
  authStateStore = create_localAuthStateStore();

//common interface for fetching the auth state of the user,
//which depends on httpOnly cookies being checked in the req
//object on the server.

//this promise resolves as a simple boolean, true meaning the user is
//properly authed, and false if not
const requestAuthState = async () => {
  const res = await fetch("/auth-state"),
    authBool = await res.json().auth;

  return authBool;
};

const checkAuth = async () => {
  pendingAuthCheckStore.pendingTrue();

  let authState, error;

  try {
    authState = await requestAuthState();
  } catch (err) {
    error = err;
  }

  if (error) {
    //likely going to include an auth error state
    authStateStore.authedFalse();
  }

  //if no error
  else if (authState) {
    authStateStore.authedTrue();
  } else {
    authStateStore.authedFalse();
  }

  pendingAuthCheckStore.pendingFalse();
};

export {
  firstAuthCheckStore,
  pendingAuthCheckStore,
  authStateStore,
  requestAuthState,
  checkAuth,
};
