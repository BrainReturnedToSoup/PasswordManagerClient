<script>
  export let pendingLogout;

  //*********************MISC***********************/

  const blankString = "";

  //****************COMPONENT-STATE****************//

  let pendingSubmit = false;
  let email, password, confirmPassword;
  let errorText = blankString;

  //*****************FORM-SUBMISSION****************//

  import { handleDeleteAccount } from "../../../../lib/settingsHandlers";

  async function onSubmit(e) {
    pendingSubmit = true;

    e.preventDefault(); //going to make a manual AJAX request rather than let the form do so automatically

    let reqError, error;

    try {
      reqError = await handleDeleteAccount(email, password);
    } catch (err) {
      error = err;
    }

    if (error) {
      errorText = error;
    }

    if (reqError) {
      errorText = reqError;
    }

    pendingSubmit = false;
  }

  //**************BUTTON-DISABLED-FLAG**************//

  $: isButtonEnabled =
    email &&
    password &&
    confirmPassword &&
    !pendingLogout &&
    !pendingSubmit &&
    !errorText;

  //******************ERROR-MESSAGE****************//

  function clearErrorText() {
    errorText = blankString;
  }
</script>

<div class="delete-account container">
  <h3 class="delete-account header">Delete Your Account</h3>

  <p class="delete-account description"></p>

  <p class="delete-account server error-message">{errorText}</p>

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
      disabled={pendingLogout}
      bind:value={email}
      on:input={() => {
        clearErrorText();
      }}
    />

    <label for="delete-account-password">Password</label>
    <input
      id="delete-account-password"
      name="password"
      type="password"
      disabled={pendingLogout}
      bind:value={password}
      on:input={() => {
        clearErrorText();
      }}
    />

    <label for="delete-account-confirm-password">Confirm Password</label>
    <input
      id="delete-account-confirm-password"
      name="confirmPassword"
      type="password"
      disabled={pendingLogout}
      bind:value={confirmPassword}
      on:input={() => {
        clearErrorText();
      }}
    />
    <button type="submit" disabled={!isButtonEnabled}
      >Delete Your Account</button
    >
  </form>
</div>
