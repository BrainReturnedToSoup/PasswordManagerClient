<script>
  export let pendingLogout;

  //*********************MISC***********************/

  const blankString = "";

  //****************COMPONENT-STATE****************//

  let pendingSubmit = false;
  let oldPassword, newPassword, confirmPassword;
  let errorText = blankString;

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
      errorText = error;
    }

    if (reqError) {
      errorText = reqError;
    }

    pendingSubmit = false;
  }

  //**************BUTTON-DISABLED-FLAG**************//

  $: isButtonEnabled =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    !pendingLogout &&
    !pendingSubmit &&
    !errorText;

  //******************ERROR-MESSAGE****************//

  function clearErrorText() {
    errorText = blankString;
  }
</script>

<div class="new-password container">
  <h3 class="new-password header">New Password</h3>

  <p class="new-password description">{errorText}</p>

  <form action="/home/settings/new-password" method="POST" on:submit={onSubmit}>
    <label for="new-password-old-password">Old Password</label>
    <input
      id="new-password-old-password"
      name="oldPassword"
      type="password"
      disabled={pendingLogout}
      bind:value={oldPassword}
      on:input={clearErrorText}
    />

    <label for="new-password-new-password">New Password</label>
    <input
      id="new-password-password"
      name="newPassword"
      type="password"
      disabled={pendingLogout}
      bind:value={newPassword}
      on:input={clearErrorText}
    />

    <label for="new-password-confirm-password">Confirm New Password</label>
    <input
      id="new-password-confirm-password"
      name="confirmPassword"
      type="password"
      disabled={pendingLogout}
      bind:value={confirmPassword}
      on:input={clearErrorText}
    />
    <button type="submit" disabled={!isButtonEnabled}>Set New Password</button>
  </form>
</div>
