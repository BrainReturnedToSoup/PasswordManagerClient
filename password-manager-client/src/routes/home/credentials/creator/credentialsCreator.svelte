<script>
  //**********COMPONENTS************/

  import CredentialForm from "../_common/credentialForm.svelte";

  //**********CRED-PAIRS************/

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

  //*********BINDED-FIELDS**********/

  let name, emailUsername, password, description; //attempt to add the credentials and update the server. if successful, the credential state will already incorporate the new credential via the credential ID and the supplied name.

  //*******FORM-SUBMISSION**********/

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import credApis from "../../../../lib/requestAPIs/credentials";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";

  let pendingSubmit = false;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isUnique(name)) {
      errorMessageStore.set(
        `Failed to add credential, the name '${name}' is
         already associated with an existing credential.`
      );

      disableSubmit();
      return;
    }

    pendingSubmit = true; //as part of disabling the submit button during pending submission

    const result = await credApis.post.credential(
      name,
      emailUsername,
      password,
      description
    );

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //upon execution, auto redirects the user to
      } else {
        errorMessageStore.set(result.error); //set the error to be displayed by the general error pop up
        disableSubmit();
      }
    } else {
      credSetStore.update((currState) => {
        return { ...currState, [result.credentialID]: name };
      }); //adds the credential pair to the state, which reuses the supplied name, and pairs it with the returned credential ID from the successful response

      clearFields();
      credCreated(); //sets the submit successful flag to true for a fixed duration
      disableSubmit(2000); //disables the submit button for a fixed duration
    }

    pendingSubmit = false;
  }

  //***********SUBMIT-LIFECYCLE***********/

  let created = false,
    submitDisabled = false;

  function credCreated(durationMs = 2000) {
    created = true;

    setTimeout(() => {
      created = false;
    }, durationMs);
  }

  function disableSubmit(delayMs = 3000) {
    submitDisabled = true;

    setTimeout(() => {
      submitDisabled = false;
    }, delayMs);
  }

  function clearFields() {
    name = "";
    emailUsername = "";
    password = "";
    description = "";
  }

  function isUnique(name) {
    return !Object.values(storeVals.credSetStore).includes(name);
  }

  //***********BUTTON-ENABLED*************/

  $: submitEnabled = !pendingSubmit && !submitDisabled; //basically to stop the abiilty to spam requests
</script>

<div class="credentials-creator">
  {#if created}
    <p>Credential Created!</p>
  {/if}

  <CredentialForm
    {handleSubmit}
    {submitEnabled}
    submitText={"Create"}
    bind:name
    bind:emailUsername
    bind:password
    bind:description
  />
</div>

<style>
</style>
