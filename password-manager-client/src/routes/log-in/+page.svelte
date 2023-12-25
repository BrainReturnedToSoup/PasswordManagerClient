<script>
  //*********TOOLS-HOOKS***********/

  import { onMount, onDestroy } from "svelte";
  import { redirect } from "@sveltejs/kit";

  //**********COMPONENTS***********/

  import Loading from "../components/loading";
  import Login from "./log-in.svelte";

  //**********AUTH-STATE***********/

  import {
    firstAuthCheckStore,
    pendingAuthCheckStore,
    authStateStore,
    checkAuthState,
  } from "../lib/authState";

  const stores = {
    firstAuthCheckStore,
    pendingAuthCheckStore,
    authStateStore,
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

  onMount(() => {
    //only check again if there isn't already a pending auth check, for instances of rapid navigation
    if (!currentAuthStoreVals.pendingAuthCheckStore) {
      checkAuthState();
      //async function for updating the auth state, includes managing auth related flags
    }
  });

  //**********AUTH-BASED-ROUTING************/

  //make sure the request for current auth status isn't currently pending
  $: if (!currentAuthStoreVals.pendingAuthCheckStore) {
    //if current auth is true
    if (currentAuthStoreVals.authStateStore) {
      redirect(200, "/home");
    }
  }
</script>

{#if currentAuthStoreVals.pendingAuthCheckStore}
  <Loading />
{:else if !currentAuthStoreVals.pendingAuthCheckStore && !currentAuthStoreVals.localAuthStateStore}
  <Login />
{/if}
