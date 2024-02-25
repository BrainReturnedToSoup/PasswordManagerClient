<script>
  //****************BINDED-INPUTS******************//

  let email, password, confirmPassword;

  //*************CONSTRAINT-VALIDATION*************//

  import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  } from "../../lib/utils/constraintValidation";

  let cvErrorMessageEmail,
    cvErrorMessagePW,
    cvErrorMessageCP,
    cvErrorMessageServer;

  $: {
    if (email) {
      cvErrorMessageEmail = validateEmail(email);
    } else {
      cvErrorMessageEmail = ""; //only display error messages when the corresponding input field isn't blank
    }
  }

  $: {
    if (password) {
      cvErrorMessagePW = validatePassword(password);
    } else {
      cvErrorMessagePW = "";
    }
  }

  $: {
    if (confirmPassword && password) {
      cvErrorMessageCP = validateConfirmPassword(confirmPassword, password);
    } else {
      cvErrorMessageCP = "";
    }
  }

  //************CLEAR-SERVER-ERROR-MESSAGE***********/

  function clearServerErrorMessage() {
    cvErrorMessageServer = "";
  }

  //*************SUBMIT-BUTTON-ENABLED**************//

  $: submitButtonEnabled =
    email &&
    password &&
    confirmPassword &&
    !cvErrorMessageEmail &&
    !cvErrorMessagePW &&
    !cvErrorMessageCP &&
    !cvErrorMessageServer &&
    !pendingSubmit;

  //*****************FORM-SUBMISSION****************//

  import { redirectToHomeStore } from "../../lib/state/auth/redirect";
  import { authStateStore } from "../../lib/state/auth/auth";
  import authApis from "../../lib/requestAPIs/auth";

  let pendingSubmit = false;

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true; //flag to prevent spamming requests for signing up

    const result = await authApis.post.signup(email, password); //handles changing auth state itself, and rerouting will take effect reactively

    if (!result.success && !result.auth) {
      cvErrorMessageServer = result.error; //an error occured somewhere in the request lifecycle (client and server)
    } else {
      redirectToHomeStore.true(); //means the user is authed from the successful login or from an existing token in cookies.
      authStateStore.authedTrue();
    }

    pendingSubmit = false; //reset the request flag
  }
</script>

<div class="page sign-up">
  {#if cvErrorMessageServer}
    <p class="server-error-response">
      {cvErrorMessageServer}
    </p>
  {/if}
  
  <form on:submit={onSubmit} novalidate>
    <div class="input-container">
      <p class="input-error email">{cvErrorMessageEmail}</p>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        on:input={clearServerErrorMessage}
        bind:value={email}
        disabled={pendingSubmit}
        required
      />
    </div>

    <div class="input-container">
      <p class="input-error password">{cvErrorMessagePW}</p>
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        on:input={clearServerErrorMessage}
        bind:value={password}
        disabled={pendingSubmit}
        required
      />
    </div>

    <div class="input-container">
      <p class="input-error confirm-password">{cvErrorMessageCP}</p>
      <label for="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        on:input={clearServerErrorMessage}
        bind:value={confirmPassword}
        disabled={pendingSubmit}
        required
      />
    </div>

    <button type="submit" disabled={!submitButtonEnabled}>Sign up!</button>
  </form>
  <a class="page-redirect-link" href="/log-in">Existing User? Log in here!</a>
</div>

<style>
</style>
