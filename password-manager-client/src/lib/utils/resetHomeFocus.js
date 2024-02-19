import {
  primaryFocusStore,
  secondaryFocusStore,
} from "../state/home/focus";

function resetHomeFocus() {
  primaryFocusStore.credentials();
  secondaryFocusStore.credentials.main();
}

export { resetHomeFocus };
