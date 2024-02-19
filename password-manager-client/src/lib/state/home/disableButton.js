import { writable } from "svelte/store";

const create_disableButtonStateStore = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,

    true: () => {
      set(true);
    },

    false: () => {
      set(false);
    },

    reset: () => {
      set(false);
    },
  };
};

const disableButtonStateStore = create_disableButtonStateStore();

export { disableButtonStateStore };
