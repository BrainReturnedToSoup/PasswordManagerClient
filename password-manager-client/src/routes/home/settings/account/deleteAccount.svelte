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

  //*******************BINDED-INPUT*****************//

  let email, password, confirmPassword;

  //**************SUBMIT-BUTTON-DISABLED************//

  //includes the disableButtonState value as part of the flags, but that
  //isn't the only thing that can disable the submit button
  $: submitButtonEnabled =
    email &&
    password &&
    confirmPassword &&
    !pendingSubmit &&
    !submitDisabled &&
    !storeVals.disableButtonStateStore;

  //*****************FORM-SUBMISSION****************//

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import { authStateStore } from "../../../../lib/state/auth/auth";
  import { redirectToLoginStore } from "../../../../lib/state/auth/redirect";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";
  import settings from "../../../../lib/requestAPIs/settings";

  let pendingSubmit = false,
    submitDisabled = false;

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true;

    const result = await settings.delete.account(email, password);

    if (!result.success) {
      if ("auth" in result && !result.auth) {
        expiredSessionRedirect(); //the user's session was expired when the req was made
      } else {
        errorMessageStore.set(result.error); //an actual error occurred
        disableSubmit();
      }
    } else {
      redirectToLoginStore.true(); //the account deleted, auto redirect to login
      authStateStore.authedFalse();
    }

    pendingSubmit = false;
  }

  function disableSubmit(delayMs = 2000) {
    submitDisabled = true;

    setTimeout(() => {
      submitDisabled = false;
    }, delayMs);
  }
</script>

<div class="delete-account container">
  <h3 class="delete-account header">Delete Your Account</h3>

  <p class="delete-account description">Desc Here</p>

  <form
    action="/home/settings/delete-account"
    method="POST"
    on:submit={onSubmit}
  >
    <label for="delete-account-email">Email</label>
    <input
      id="delete-account-email"
      name="email"
      type="email"
      disabled={storeVals.disableButtonStateStore}
      bind:value={email}
    />

    <label for="delete-account-password">Password</label>
    <input
      id="delete-account-password"
      name="password"
      type="password"
      disabled={storeVals.disableButtonStateStore}
      bind:value={password}
    />

    <label for="delete-account-confirm-password">Confirm Password</label>
    <input
      id="delete-account-confirm-password"
      name="confirmPassword"
      type="password"
      disabled={storeVals.disableButtonStateStore}
      bind:value={confirmPassword}
    />
    <button type="submit" disabled={!submitButtonEnabled}>Delete</button>
  </form>
</div>
