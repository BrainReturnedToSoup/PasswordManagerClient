const primaryFocusEnums = Object.freeze({
  credentials: "credentials",
  settings: "settings",
});

const secondaryFocusEnums = Object.freeze({
  credentials: Object.freeze({
    main: "main", //for the main credentials focus, the default focus essentially
    creator: "creator",
  }),
  settings: Object.freeze({
    account: "account",
    preferences: "preferences",
    faq: "faq",
  }),
});

export { primaryFocusEnums, secondaryFocusEnums };
