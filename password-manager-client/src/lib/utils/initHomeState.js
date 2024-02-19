import { authStateStore } from "../state/auth/auth";
import { redirectToLoginStore } from "../state/auth/redirect";
import { settingsDataStore } from "../state/home/settings";
import { credSetStore } from "../state/home/credSet";
import { errorMessageStore } from "../state/home/error";
import credApis from "../requestAPIs/credentials";
import settingsApis from "../requestAPIs/settings";

const initHomeState = {
  settings: async () => {
    const result = await settingsApis.get.data();

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        redirectToLoginStore.true();
        authStateStore.authedFalse();
        return;
      }

      errorMessageStore.set(result.error);
      return;
    }

    settingsDataStore.set(result.settings); //is already a single object with the properties
  },

  credSet: async () => {
    const result = await credApis.get.idAndNameSet();

    if (!result) {
      if ("auth" in result && !result.auth) {
        redirectToLoginStore.true();
        authStateStore.authedFalse();
        return;
      }

      errorMessageStore.set(result.error);
      return;
    }

    //converts the supplied set, which exists as an array of record objects (postgres), to an object. this will make for a better system for state updates.
    const convertedSet = {};

    for (const element of result.idAndNameSet) {
      convertedSet[element.credential_id] = element.credential_name;
    }

    credSetStore.set(convertedSet);
  },
};

export default initHomeState;
