import { writable } from "svelte/store";
import { secondaryFocusEnums } from "../../routes/home/pageFocusEnums";

const create_settingsSecondaryFocusStore = () => {
  const { subscribe, set } = writable(secondaryFocusEnums.settings.account);

  return {
    subscribe,
    account: () => {
      set(secondaryFocusEnums.settings.account);
    },
    preferences: () => {
      set(secondaryFocusEnums.settings.preferences);
    },
    faq: () => {
      set(secondaryFocusEnums.settings.faq);
    },
  };
};

const create_settingsHasScrolledStore = () => {
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

const settingsSecondaryFocusStore = create_settingsSecondaryFocusStore(),
  settingsHasScrolledStore = create_settingsHasScrolledStore();

export { settingsSecondaryFocusStore, settingsHasScrolledStore };
