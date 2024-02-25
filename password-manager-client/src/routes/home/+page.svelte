<script>
  //**********COMPONENTS***********/

  import Loading from "../loading.svelte";
  import Home from "./home.svelte";

  //**********AUTH-STATE***********/

  import { onDestroy } from "svelte";
  import { redirectToHomeStore } from "../../lib/state/auth/redirect";
  import {
    pendingAuthCheckStore,
    authStateStore,
  } from "../../lib/state/auth/auth";

  const stores = {
    pendingAuthCheckStore,
    authStateStore,
    redirectToHomeStore,
  }; //for property name reuse for extracting store values
  let storeVals = {}; //reactive, as it contains the actual values of the store states

  //for initializing the subscription instances, and ensuring proper cleanup
  for (const [name, store] of Object.entries(stores)) {
    const unsubscribe = store.subscribe((state) => {
      const clone = { ...storeVals };
      clone[name] = state;
      storeVals = clone; //to activate reactivity on change
    });

    onDestroy(unsubscribe); //ensure to unsubscribe on component destruction
  }

  //*************CHECK-AUTH-STATE***********/

  import checkAuth from "../../lib/utils/checkAuth";

  if (!storeVals.pendingAuthCheckStore && !storeVals.redirectToHomeStore) {
    checkAuth(); //async function for updating the auth state, includes managing auth related flags. has its own error handling internally.
  }

  //store used to prevent redundant auth checks for situations where you are redirecting from /home
  //from some type of action resulting in a deauth, be it a log out or session expiry.
  //setting this to false ensures that the next time this page is routed to otherwise, the auth is checked as normal.
  redirectToHomeStore.false();

  //**********AUTH-BASED-ROUTING***********/

  import { goto } from "$app/navigation";

  //redirect to the login page if the auth check is not pending, and the user is not authed.
  $: if (!storeVals.pendingAuthCheckStore && !storeVals.authStateStore) {
    goto("/log-in");
  }

  //************INIT-HOME-STATE************/

  import initHomeState from "../../lib/utils/initHomeState";

  let retrievedEmail = "";
  let pendingInit = false; //for loading screen rendering

  async function init() {
    pendingInit = true;

    await initHomeState.settings();
    await initHomeState.credSet();

    retrievedEmail = await initHomeState.email();

    pendingInit = false;
  }

  //if the user is currently authed, fetch the corresponding data to make the web page work
  //this should only execute if explicit auth state checks are made and return true
  $: if (!storeVals.pendingAuthCheckStore && storeVals.authStateStore) {
    init();
  }
</script>

{#if !storeVals.pendingAuthCheckStore && storeVals.authStateStore && !pendingInit}
  <Home email={retrievedEmail} />
{:else}
  <Loading />
{/if}
