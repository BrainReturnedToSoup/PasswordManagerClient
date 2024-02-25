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

  //*****************BINDED-INPUT**************//

  let oldEmail, password, newEmail;

  //************CONSTRAINT-VALIDATION**********//

  import { validateEmail } from "../../../../lib/utils/constraintValidation";

  let cvErrorMessageEmail;

  $: {
    if (newEmail) {
      cvErrorMessageEmail = validateEmail(newEmail);
    } else {
      cvErrorMessageEmail = "";
    }
  }

  //*************BUTTON-DISABLED-FLAG**********//

  $: submitButtonEnabled =
    oldEmail &&
    password &&
    newEmail &&
    !cvErrorMessageEmail &&
    !pendingSubmit &&
    !submitDisabled &&
    !storeVals.disableButtonStateStore;

  //***************FORM-SUBMISSION**************//

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import { authStateStore } from "../../../../lib/state/auth/auth";
  import { redirectToLoginStore } from "../../../../lib/state/auth/redirect";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";
  import settingsApis from "../../../../lib/requestAPIs/settings";

  let pendingSubmit = false,
    submitDisabled = false;

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true;

    const result = await settingsApis.put.email(oldEmail, password, newEmail);

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

<div class="update-email">
  <h3 class="update-email header">Update Account Email</h3>

  <p class="update-email description">Desc Here</p>

  <form on:submit={onSubmit}>
    <div class="update-email current-email container">
      <label for="update-email-current-email">Current Email</label>
      <input
        id="update-email-current-email"
        type="email"
        name="email"
        disabled={storeVals.disableButtonStateStore}
        bind:value={oldEmail}
      />
    </div>

    <div class="update-email password container">
      <label for="update-email-password">Password</label>
      <input
        id="update-email-password"
        type="password"
        name="password"
        disabled={storeVals.disableButtonStateStore}
        bind:value={password}
      />
    </div>

    <p class="update-email-new-email error-message">{cvErrorMessageEmail}</p>

    <div class="update-email new-email container">
      <label for="update-email-new-email">New Email</label>
      <input
        id="update-email-new-email"
        type="email"
        name="newEmail"
        disabled={storeVals.disableButtonStateStore}
        bind:value={newEmail}
      />
    </div>

    <button type="submit" disabled={!submitButtonEnabled}>Set</button>
  </form>
</div>
