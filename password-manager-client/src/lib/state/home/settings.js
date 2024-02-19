import { writable } from "svelte/store";

const create_settingsDataStore = () => {
  const { subscribe, update, set } = writable({});

  return {
    subscribe,
    update,
    set,
    clear: () => {
      set({});
    },
  };
};

const create_settingsNavClicked = () => {
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

const settingsDataStore = create_settingsDataStore(),
  settingsNavClickedStore = create_settingsNavClicked();

export { settingsDataStore, settingsNavClickedStore };
