import { writable } from "svelte/store";

import {
  primaryFocusEnums,
  secondaryFocusEnums,
} from "../../../routes/home/pageFocusEnums";

const create_primaryFocusStore = () => {
  const { subscribe, set } = writable(primaryFocusEnums.credentials);

  return {
    subscribe,

    credentials: () => {
      set(primaryFocusEnums.credentials);
    },

    settings: () => {
      set(primaryFocusEnums.settings);
    },

    reset: () => {
      set(primaryFocusEnums.credentials);
    },
  };
};

const create_secondaryFocusStore = () => {
  const { subscribe, set } = writable(secondaryFocusEnums.credentials.main);

  return {
    subscribe,

    credentials: {
      main: () => {
        set(secondaryFocusEnums.credentials.main);
      },
      creator: () => {
        set(secondaryFocusEnums.credentials.creator);
      },
      updater: () => {
        set(secondaryFocusEnums.credentials.updater);
      },
    },

    settings: {
      account: () => {
        set(secondaryFocusEnums.settings.account);
      },
      preferences: () => {
        set(secondaryFocusEnums.settings.preferences);
      },
      faq: () => {
        set(secondaryFocusEnums.settings.faq);
      },
    },

    reset: () => {
      set(secondaryFocusEnums.credentials.main);
    },
  };
};


const primaryFocusStore = create_primaryFocusStore(),
  secondaryFocusStore = create_secondaryFocusStore();

export { primaryFocusStore, secondaryFocusStore };
