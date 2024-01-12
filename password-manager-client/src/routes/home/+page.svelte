<script>
  //*********TOOLS-HOOKS***********/

  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  //**********COMPONENTS***********/

  import Loading from "../loading.svelte";
  import Home from "./home.svelte";

  //**********AUTH-STATE***********/

  import {
    pendingAuthCheckStore,
    authStateStore,
    checkAuth,
    redirectToHomeStore,
  } from "../../lib/state/authState";

  const stores = {
    pendingAuthCheckStore,
    authStateStore,
    redirectToHomeStore,
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
    !currentAuthStoreVals.redirectToHomeStore
  ) {
    //async function for updating the auth state, includes managing auth related flags.
    //has its own error handling internally.
    checkAuth();
  }

  //always set this to false after the 'checkAuth' condition, as it is used to
  //prevent redundant auth checks for situations where you are redirecting to home
  //from a login/signup form submission which already validated your auth status
  stores.redirectToHomeStore.false();

  //**********AUTH-BASED-ROUTING************/

  //make sure the request for current auth status isn't currently pending
  $: if (
    !currentAuthStoreVals.pendingAuthCheckStore &&
    !currentAuthStoreVals.authStateStore
  ) {
    //will check condition each time the above dependencies change in value
    goto("/log-in");
  }
</script>

{#if !currentAuthStoreVals.pendingAuthCheckStore && currentAuthStoreVals.authStateStore}
  <Home />
{:else}
  <Loading />
{/if}
