<script>
  //***********SETTINGS-DATA**********/

  import { onDestroy } from "svelte";
  import { settingsDataStore } from "../../../../lib/state/home/settings";

  const stores = {
    settingsDataStore,
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

  //**********BINDED-INPUTS***********/

  let code;

  //**********SUBMIT-ENABLED**********/

  $: submitEnabled = code && !verifyCodeDisabled;

  //************SEND-CODE*************/

  import settingsApis from "../../../../lib/requestAPIs/settings";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";
  import { errorMessageStore } from "../../../../lib/state/home/error";

  let codePending = false,
    sendCodeDisabled = false,
    retryMessage = false;

  async function sendCode() {
    codePending = true;

    if (!retryMessage) retryMessage = true; //for initial message display on first verification

    const result = await settingsApis.verifyEmail.post();

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //the user's session was expired when the req was made
      } else {
        errorMessageStore.set(result.error); //an actual error occurred
        disableSendCode();
      }
    } else {
      disableSendCode(1000); //disable the send code button for only one second to prevent spam
    }

    codePending = false;
  }

  function disableSendCode(delayMs = 2000) {
    sendCodeDisabled = true;

    setTimeout(() => {
      sendCodeDisabled = false;
    }, delayMs);
  }

  //***********VERIFY-CODE************/

  let verifyPending = false,
    verifyCodeDisabled = false;

  async function verifyCode() {
    verifyPending = true;

    const result = await settingsApis.verifyEmail.put(code);

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //the user's session was expired when the req was made
      } else {
        errorMessageStore.set(result.error); //an actual error occurred
        disableVerifyCode();
      }
    } else {
      //updates the local state for settings, which will cause verification section to rerender
      //which displays to the user that they are already verified.
      settingsDataStore.update((currState) => {
        return { ...currState, verified: true };
      });
    }

    verifyPending = false;
  }

  function disableVerifyCode(delayMs = 3000) {
    verifyCodeDisabled = true;

    setTimeout(() => {
      verifyCodeDisabled = false;
    }, delayMs);
  }
</script>

<div class="verify-email container">
  <h3 class="verify-email header">Verify Email</h3>

  {#if storeVals.settingsDataStore.verified}
    <p>Your account is verified!</p>
  {:else}
    <p class="verify-email description">
      You have not verified your email associated with this account. Verify your
      account by submitting the code sent to your email!
    </p>

    {#if retryMessage}
      <p>
        If you do not see the code in your email, check your spam. If it is not
        in spam, click the 'send code' button again.
      </p>
    {/if}

    <button on:click={sendCode} disabled={sendCodeDisabled}
      >Send Verification Code</button
    >

    <form on:submit={verifyCode}>
      <label for="verify-email-code-input">Verification Code</label>
      <input
        id="verify-email-code-input"
        name="verification-code"
        bind:value={code}
      />
      <button disabled={!submitEnabled} type="submit">Verify</button>
    </form>
  {/if}
</div>
