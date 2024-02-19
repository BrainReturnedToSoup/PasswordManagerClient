import { writable } from "svelte/store";

//for preventing redundant auth checks after rerouting due to an auth state
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

//for preventing redundant auth checks after rerouting due to an auth state
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

const redirectToHomeStore = create_redirectToHomeStore(), //for preventing redundant auth check request on the home page if authed through login/signup
  redirectToLoginStore = create_redirectToLoginStore(); //for preventing redundant auth check request on the login page based on a logout redirect

export { redirectToHomeStore, redirectToLoginStore };
