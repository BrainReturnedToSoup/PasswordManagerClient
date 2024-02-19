import { writable } from "svelte/store";

const create_updaterStateStore = () => {
  const { subscribe, set, update } = writable({
    credentialID: null,
    name: null,
    emailUsername: null,
    password: null,
    description: null,
  });

  return {
    subscribe,
    set,
    update,
    clear: () => {
      set({
        credentialID: null,
        name: null,
        emailUsername: null,
        password: null,
        description: null,
      });
    },
  };
};

const updaterStateStore = create_updaterStateStore();

export { updaterStateStore };
