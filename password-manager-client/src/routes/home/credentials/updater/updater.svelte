<script>
  import CredentialForm from "../_common/credentialForm.svelte";

  //***********STORE-VALS****************/

  import { onDestroy } from "svelte";
  import { updaterStateStore } from "../../../../lib/state/home/updater";
  import { credSetStore } from "../../../../lib/state/home/credSet";

  const stores = {
    updaterStateStore,
    credSetStore,
  };
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

  //**********BINDED-INPUTS**************/

  let name, emailUsername, password, description;

  //***********FORM-SUBMISSION************/

  //takes the binded values, and compares them to the updater state store. Whichever input is different
  //add the change to the update credential request object. Use the credential ID that is stored
  //in the updaterState in order to define the resource being updated (i.e. the specific credential).

  //if the change is to the credential name itself, then reflect the change in the idAndNameset state store.

  //This is turn will make the update mechanism on the server reasonably efficient, which the credential list
  //index strategy will also only rerender what is necessary.

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";
  import credApis from "../../../../lib/requestAPIs/credentials";

  let pendingSubmit = false;

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = generatePayload(); //generates a payload including fields that changed

    //will only exist if the name property is being changed, thus make sure it doesn't match an existing name
    if ("name" in payload && !isUnique(payload.name)) {
      errorMessageStore.set(
        `Failed to update credential, the name '${name}' is
         already associated with a different existing credential.`
      );

      disableSubmit();
      return;
    }

    pendingSubmit = true; //as part of disabling the submit button during pending

    const result = await credApis.put.credential(
      storeVals.updaterStateStore.credentialID,
      payload
    );

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //upon execution, auto redirects the user to
      } else {
        errorMessageStore.set(result.error); //set the error to be displayed by the general error pop up
        disableSubmit();
      }
    } else {
      updateCredentialState(payload); //update the credential state, which only occurs if the name property changes
      credUpdated(); //sets the submit successful flag to true for a fixed duration
      disableSubmit(2000); //disables the submit button for a fixed duration
    }

    pendingSubmit = false;
  }

  //generate a payload of only the properties that have been updated.
  //This is only invoked if atleast something is different
  function generatePayload() {
    const payload = {};

    if (name !== storeVals.updaterStateStore.name) {
      payload.name = name;
    }

    if (emailUsername !== storeVals.updaterStateStore.emailUsername) {
      payload.emailUsername = emailUsername;
    }

    if (password !== storeVals.updaterStateStore.password) {
      payload.password = password;
    }

    if (description !== storeVals.updaterStateStore.description) {
      payload.description = description;
    }

    return payload;
  }

  //if one of the changes was the name property of the credential, update the store containing ID and name pairs for credentials.
  function updateCredentialState(payload) {
    if ("name" in payload) {
      credSetStore.update((currState) => {
        return {
          ...currState,
          [storeVals.updaterStateStore.credentialID]: payload.name,
        };
      });
    }

    //sets the updater state to equal the new values applied to the same credential
    updaterStateStore.update((currState) => {
      return { ...currState, ...payload }; //takes the current state, and overwrites any matching properties that appear in the payload
    });
  }

  //***********SUBMIT-LIFECYCLE***********/

  let updated = false,
    submitDisabled = false;

  function credUpdated(durationMs = 2000) {
    updated = true;

    setTimeout(() => {
      updated = false;
    }, durationMs);
  }

  function disableSubmit(delayMs = 3000) {
    submitDisabled = true;

    setTimeout(() => {
      submitDisabled = false;
    }, delayMs);
  }

  function isUnique(name) {
    return !Object.values(storeVals.credSetStore).includes(name);
  }

  //************FIELD-VALUE-SYNC**********/

  import { onMount } from "svelte";

  onMount(() => {
    name = storeVals.updaterStateStore.name;
    emailUsername = storeVals.updaterStateStore.emailUsername;
    password = storeVals.updaterStateStore.password;
    description = storeVals.updaterStateStore.description;
  }); //when the component mounts, set the stored values to the binded inputs, thus the user can alter the existing field values

  //***********BUTTON-ENABLED*************/

  //boolean representing if the current fields in the update pop up
  //differ from their original values. You can only update if there is some type of difference obviously
  $: valuesDifferent =
    storeVals.updaterStateStore.name !== name ||
    storeVals.updaterStateStore.emailUsername !== emailUsername ||
    storeVals.updaterStateStore.password !== password ||
    storeVals.updaterStateStore.description !== description;

  $: submitEnabled = !pendingSubmit && !submitDisabled && valuesDifferent;
</script>

<div class="credentials-updater">
  {#if updated}
    <p>Credential Updated!</p>
  {/if}

  <CredentialForm
    {handleSubmit}
    {submitEnabled}
    submitText={"Update"}
    bind:name
    bind:emailUsername
    bind:password
    bind:description
  />
</div>
