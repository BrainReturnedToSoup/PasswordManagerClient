<script>
  //*********TOOLS-HOOKS***********/

  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  //**********COMPONENTS***********/

  import Loading from "../loading.svelte";
  import Login from "./log-in.svelte";

  //**********AUTH-STATE***********/

  import {
    pendingAuthCheckStore,
    authStateStore,
    checkAuth,
    redirectToLoginStore,
  } from "../../lib/state/authState";

  const stores = {
    pendingAuthCheckStore,
    authStateStore,
    redirectToLoginStore,
  }; //for property name reuse

  const subscriptions = {};
  let currentAuthStoreVals = {}; //reactive, as it contains the actual values of the store states

  //for initializing the subscription instances, and ensuring proper cleanup
  for (const [name, store] of Object.entries(stores)) {
    subscriptions[name] = store.subscribe((state) => {
      const clone = { ...currentAuthStoreVals };
      clone[name] = state;
      currentAuthStoreVals = clone; //to activate reactivity on change
    });

    onDestroy(subscriptions[name]); //ensure to unsubscribe on component destruction
  }

  if (
    !currentAuthStoreVals.pendingAuthCheckStore &&
    !currentAuthStoreVals.redirectToLoginStore
  ) {
    checkAuth();

    //async function for updating the auth state, includes managing auth related flags.
    //has its own error handling internally
  }

  //always set this to false after the 'checkAuth' condition, as it is used to
  //prevent redundant auth checks for situations where you are redirecting from /home
  //from an explicit logout by the user
  stores.redirectToLoginStore.false();

  //**********AUTH-BASED-ROUTING************/

  //make sure the request for current auth status isn't currently pending
  $: if (
    !currentAuthStoreVals.pendingAuthCheckStore &&
    currentAuthStoreVals.authStateStore
  ) {
    goto("/home");
  }
</script>

{#if currentAuthStoreVals.pendingAuthCheckStore}
  <Loading />
{:else if !currentAuthStoreVals.pendingAuthCheckStore && !currentAuthStoreVals.localAuthStateStore}
  <Login />
{/if}
