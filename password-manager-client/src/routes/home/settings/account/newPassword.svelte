<script>
  export let pendingLogout;

  //*********************MISC***********************/

  const blankString = "";

  //****************COMPONENT-STATE****************//

  let pendingSubmit = false;

  let oldPassword, newPassword, confirmPassword;

  let errorTextServer = blankString,
    errorTextNewPassword = blankString,
    errorTextConfirmPassword = blankString;

  //*************CONSTRAINT-VALIDATION*************//

  import {
    validatePassword,
    validateConfirmPassword,
  } from "../../../../lib/constraintValidation";

  $: {
    if (newPassword !== blankString) {
      errorTextNewPassword = validatePassword(newPassword);
    } else {
      errorTextNewPassword = blankString;
    }
  }

  //included 'newPassword' condition for the sake of triggering reactivity based on
  //changes to both confirmPassword and newPassword
  $: {
    if (confirmPassword !== blankString && newPassword !== blankString) {
      errorTextConfirmPassword = validateConfirmPassword(
        confirmPassword,
        newPassword
      );
    } else {
      errorTextConfirmPassword = blankString;
    }
  }

  //*****************FORM-SUBMISSION****************//

  import { handleNewPassword } from "../../../../lib/settingsHandlers";

  async function onSubmit(e) {
    pendingSubmit = true;

    e.preventDefault(); //going to make a manual AJAX request rather than let the form do so automatically

    let reqError, error;

    try {
      reqError = await handleNewPassword(oldPassword, newPassword);
    } catch (err) {
      error = err;
    }

    if (error) {
      errorTextServer = error;
    }

    if (reqError) {
      errorTextServer = reqError;
    }

    pendingSubmit = false;
  }

  //**************BUTTON-DISABLED-FLAG**************//

  $: isButtonEnabled =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    !errorTextServer &&
    !errorTextNewPassword &&
    !errorTextConfirmPassword &&
    !pendingLogout &&
    !pendingSubmit;

  //******************ERROR-MESSAGE****************//

  function clearErrorTextServer() {
    errorTextServer = blankString;
  }

  function clearErrorTextNewPw() {
    errorTextNewPassword = blankString;
  }

  function clearErrorTextConfirmPw() {
    errorTextConfirmPassword = blankString;
  }
</script>

<div class="new-password container">
  <h3 class="new-password header">New Password</h3>

  <p class="new-password description"></p>

  <p class="new-password server error-message">{errorTextServer}</p>

  <form on:submit={onSubmit}>
    <div class="new-password-old-password container">
      <label for="new-password-old-password">Old Password</label>
      <input
        id="new-password-old-password"
        name="oldPassword"
        type="password"
        disabled={pendingLogout}
        bind:value={oldPassword}
        on:input={clearErrorTextServer}
      />
    </div>

    <div class="new-password-new-password container">
      <p class="new-password-new-password error-message">
        {errorTextNewPassword}
      </p>

      <label for="new-password-new-password">New Password</label>
      <input
        id="new-password-password"
        name="newPassword"
        type="password"
        disabled={pendingLogout}
        bind:value={newPassword}
        on:input={() => {
          clearErrorTextServer();
          clearErrorTextNewPw();
        }}
      />
    </div>

    <div class="new-password-confirm-password container">
      <p class="new-password-confirm-password error-message">
        {errorTextConfirmPassword}
      </p>

      <label for="new-password-confirm-password">Confirm New Password</label>
      <input
        id="new-password-confirm-password"
        name="confirmPassword"
        type="password"
        disabled={pendingLogout}
        bind:value={confirmPassword}
        on:input={() => {
          clearErrorTextServer();
          clearErrorTextConfirmPw();
        }}
      />
    </div>

    <button type="submit" disabled={!isButtonEnabled}>Set New Password</button>
  </form>
</div>
