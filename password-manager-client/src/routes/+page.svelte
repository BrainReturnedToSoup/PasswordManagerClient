<script>
  //*********TOOLS-HOOKS***********/

  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  //**********COMPONENTS***********/

  import Loading from "./loading.svelte";

  //**********AUTH-STATE***********/

  import {
    pendingAuthCheckStore,
    authStateStore,
    checkAuth,
  } from "../lib/state/authState";

  const stores = {
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

  if (!currentAuthStoreVals.pendingAuthCheckStore) {
    checkAuth();
    //async function for updating the auth state, includes managing auth related flags.
    //has its own error handling internally
  }

  //**********AUTH-BASED-ROUTING************/

  //make sure the request for current auth status isn't currently pending
  //the value of this store is a boolean
  $: if (!currentAuthStoreVals.pendingAuthCheckStore) {
    //the value of this store is a boolean
    if (currentAuthStoreVals.authStateStore) {
      goto("/home");
    } else {
      goto("/log-in");
    }
  }
</script>

<!--no need for a conditional, as the redirect will take care of the event of auth
state request resolution. -->
<Loading />
