<script>
  export let handleSubmit, submitEnabled, submitText; //parent props
  export let name, emailUsername, password, description; //binded props

  //*****DISABLE-BUTTON********/

  import { onDestroy } from "svelte";
  import { disableButtonStateStore } from "../../../../lib/state/home/disableButton";

  const stores = {
    disableButtonStateStore,
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

  //*******SUBMIT-FLAG*********/

  $: submitButtonEnabled = submitEnabled && !storeVals.disableButtonStateStore;
</script>

<form on:submit={handleSubmit}>
  <div class="credential-creator name container">
    <label for="credential-creator-name">Name</label>
    <input
      id="credential-creator-name"
      type="text"
      bind:value={name}
      disabled={storeVals.disableButtonStateStore}
      required
    />
  </div>

  <div class="credential-creator email container">
    <label for="credential-creator-email-username">Email/Username</label>
    <input
      id="credential-creator-email-username"
      type="text"
      bind:value={emailUsername}
      disabled={storeVals.disableButtonStateStore}
    />
  </div>

  <div class="credential-creator password">
    <label for="credential-creator-password">Password</label>
    <input
      id="credential-creator-password"
      type="password"
      bind:value={password}
    />
  </div>

  <div class="credential-creator description">
    <label for="credential-creator-description">Description</label>
    <textarea
      id="credential-creator-description"
      bind:value={description}
      disabled={storeVals.disableButtonStateStore}
    ></textarea>
  </div>

  <button type="submit" disabled={!submitButtonEnabled}>{submitText}</button>
</form>
