import { writable } from "svelte/store";

const create_credSetStore = () => {
  const { subscribe, set, update } = writable({});

  return {
    subscribe,
    set,
    update,
    clear: () => {
      set({});
    },
  };
};

const credSetStore = create_credSetStore();

export { credSetStore };
