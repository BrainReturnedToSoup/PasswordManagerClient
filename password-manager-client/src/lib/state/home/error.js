import { writable } from "svelte/store";

const create_errorMessageStore = () => {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    set,
    clear: () => {
      set("");
    },
  };
};

const errorMessageStore = create_errorMessageStore();

export { errorMessageStore };
