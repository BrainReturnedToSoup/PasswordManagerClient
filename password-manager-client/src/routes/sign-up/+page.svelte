<script>
  //**********COMPONENTS***********/

  import Loading from "../loading.svelte";
  import Signup from "./sign-up.svelte";

  //**********AUTH-STATE***********/

  import { onDestroy } from "svelte";
  import {
    pendingAuthCheckStore,
    authStateStore,
  } from "../../lib/state/auth/auth";

  const stores = {
    pendingAuthCheckStore,
    authStateStore,
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

  //**********AUTH-BASED-ROUTING************/

  import { goto } from "$app/navigation";

  //redirect to home if the auth check is not pending, and the user authed already.
  $: if (!storeVals.pendingAuthCheckStore && storeVals.authStateStore) {
    goto("/home");
  }
</script>

{#if !storeVals.pendingAuthCheckStore && !storeVals.localAuthStateStore}
  <Signup />
{:else}
  <Loading />
{/if}
