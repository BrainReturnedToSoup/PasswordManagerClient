import { writable } from "svelte/store";

//used to keep track of whether the app has made a request to check the current
//auth status of the user. This is important for determining routing behaviors.

//for specific conditions such as for creating conditional loading screens while the auth state promise is pending
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

//represents the auth state, which defines routing behaviors as well
const create_authStateStore = () => {
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
  authStateStore = create_authStateStore();

export {
  pendingAuthCheckStore,
  authStateStore,
};
