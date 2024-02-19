<script>
  //********COMPONENTS********/

  import Main from "./main/main.svelte";
  import Creator from "./creator/credentialsCreator.svelte";
  import Updater from "./updater/updater.svelte";

  //********PAGE-FOCUS********/

  import { onDestroy } from "svelte";
  import { secondaryFocusStore } from "../../../lib/state/home/focus";
  import { secondaryFocusEnums } from "../pageFocusEnums";

  const stores = {
    secondaryFocusStore,
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
</script>

<div class="credentials container">
  {#if storeVals.secondaryFocusStore === secondaryFocusEnums.credentials.main}
    <Main />
  {:else if storeVals.secondaryFocusStore === secondaryFocusEnums.credentials.creator}
    <Creator />
  {:else if storeVals.secondaryFocusStore === secondaryFocusEnums.credentials.updater}
    <Updater />
  {/if}
</div>

<style>
</style>
