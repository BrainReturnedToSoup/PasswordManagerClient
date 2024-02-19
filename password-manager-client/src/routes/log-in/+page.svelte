<script>
  //**********COMPONENTS***********/

  import Loading from "../loading.svelte";
  import Login from "./log-in.svelte";

  //**********AUTH-STATE***********/

  import { onDestroy } from "svelte";
  import { redirectToLoginStore } from "../../lib/state/auth/redirect";
  import {
    pendingAuthCheckStore,
    authStateStore,
  } from "../../lib/state/auth/auth";

  const stores = {
    pendingAuthCheckStore,
    authStateStore,
    redirectToLoginStore,
  }; //for property name reuse
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

  if (!storeVals.pendingAuthCheckStore) {
    checkAuth(); //async function for retrieving the auth state and reflecting it in the auth state store
  }

  //store used to prevent redundant auth checks for situations where you are redirecting from /home
  //from some type of action resulting in a deauth, be it a log out or session expiry.
  //setting this to false ensures that the next time this page is routed to otherwise, the auth is checked as normal.
  redirectToLoginStore.false();

  //**********AUTH-BASED-ROUTING************/

  import { goto } from "$app/navigation";

  //redirect to home if the auth check is not pending, and the user authed already.
  $: if (!storeVals.pendingAuthCheckStore && storeVals.authStateStore) {
    goto("/home");
  }
</script>

{#if !storeVals.pendingAuthCheckStore && !storeVals.authStateStore}
  <Login />
{:else}
  <Loading />
{/if}
