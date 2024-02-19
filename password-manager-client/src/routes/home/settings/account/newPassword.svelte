<script>
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

  //******************INPUT-STATE******************//

  let oldPassword, newPassword, confirmNewPassword;

  //*************CONSTRAINT-VALIDATION*************/

  import {
    validatePassword,
    validateConfirmPassword,
  } from "../../../../lib/utils/constraintValidation";

  let errorTextNewPassword = "",
    errorTextConfirmPassword = "";

  $: {
    if (newPassword !== "") {
      errorTextNewPassword = validatePassword(newPassword);
    } else {
      errorTextNewPassword = "";
    }
  }

  //included 'newPassword' condition for the sake of triggering reactivity based on changes to both confirmPassword and newPassword
  $: {
    if (confirmNewPassword !== "" && newPassword !== "") {
      errorTextConfirmPassword = validateConfirmPassword(
        confirmNewPassword,
        newPassword
      );
    } else {
      errorTextConfirmPassword = "";
    }
  }

  //************BUTTON-DISABLED-FLAG**************/

  $: submitButtonEnabled =
    oldPassword &&
    newPassword &&
    confirmNewPassword &&
    buttonEnabled &&
    !errorTextNewPassword &&
    !errorTextConfirmPassword &&
    !pendingSubmit &&
    !submitDisabled &&
    !storeVals.disableButtonStateStore;

  //***************FORM-SUBMISSION****************/

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import { authStateStore } from "../../../../lib/state/auth/auth";
  import { redirectToLoginStore } from "../../../../lib/state/auth/redirect";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";
  import settings from "../../../../lib/requestAPIs/settings";

  let pendingSubmit = false;

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true;

    const result = await settings.put.password(oldPassword, newPassword);

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //the user's session was expired when the req was made
      } else {
        errorMessageStore.set(result.error); //an actual error occurred
        submitDisabledDelay();
      }
    } else {
      redirectToLoginStore.true(); //the account deleted, auto redirect to login
      authStateStore.authedFalse();
    }

    pendingSubmit = false;
  }

  //*********************DISABLED*********************/

  let submitDisabled = false;

  function submitDisabledDelay(delayMs = 2000) {
    submitDisabled = true;

    setTimeout(() => {
      submitDisabled = false;
    }, delayMs);
  }
</script>

<div class="new-password container">
  <h3 class="new-password header">New Password</h3>

  <p class="new-password description">Desc Here</p>

  <form on:submit={onSubmit}>
    <div class="new-password-old-password container">
      <label for="new-password-old-password">Old Password</label>
      <input
        id="new-password-old-password"
        name="oldPassword"
        type="password"
        disabled={storeVals.disableButtonStateStore}
        bind:value={oldPassword}
      />
    </div>

    <p class="new-password-new-password error-message">
      {errorTextNewPassword}
    </p>

    <div class="new-password-new-password container">
      <label for="new-password-new-password">New Password</label>
      <input
        id="new-password-new-password"
        name="newPassword"
        type="password"
        disabled={storeVals.disableButtonStateStore}
        bind:value={newPassword}
      />
    </div>

    <p class="new-password-confirm-password error-message">
      {errorTextConfirmPassword}
    </p>

    <div class="new-password-confirm-password container">
      <label for="new-password-confirm-password">Confirm New Password</label>
      <input
        id="new-password-confirm-password"
        name="confirmPassword"
        type="password"
        disabled={storeVals.disableButtonStateStore}
        bind:value={confirmNewPassword}
      />
    </div>

    <button type="submit" disabled={!submitButtonEnabled}>Set</button>
  </form>
</div>
