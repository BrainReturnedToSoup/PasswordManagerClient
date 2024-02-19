<script>
  //*********ERROR-STATE***********/

  import { onDestroy } from "svelte";
  import { errorMessageStore } from "../../../lib/state/home/error";

  const stores = {
    errorMessageStore,
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

  //DO NOT DELETE OR SIMPLIFY, SVELTEKIT NO LIKE WHEN USE STORES
  //WITHIN EVENT HANDLER BLOCKS, HAD TO DECLARE IT AS AN API WITHIN SCRIPT TAG
  function clearMessage() {
    errorMessageStore.clear();
  }
</script>

{#if storeVals.errorMessageStore}
  <button on:click={clearMessage}>X</button>
  <div class="error-popup container">
    <p class="error-message">{storeVals.errorMessageStore}</p>
  </div>
{/if}
