<script>
  //********COMPONENTS********/

  import Credential from "./credential.svelte";

  //********CRED-PAIRS********/

  import { onDestroy } from "svelte";
  import { credSetStore } from "../../../../lib/state/home/credSet";

  const stores = {
    credSetStore,
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

<div class="credentials-main">
  <div class="credentials-search">
    <!-- TO BE ADDED -->
  </div>

  <div class="credentials-list">
    {#each Object.entries(storeVals.credSetStore) as [id, name] (id)}
      <Credential {id} {name} />
    {/each}
  </div>
</div>

<style>
  .credentials-list {
    overflow-y: scroll;
  }
</style>
