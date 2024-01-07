<script>
  //returns validation error messages based on whether the supplied
  //inputs are valid or not
  import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  } from "../../lib/constraintValidation";

  import { handleSignupRequest } from "../../lib/formSubmissionHandling";

  //****************COMPONENT-STATE****************//

  let email, password, confirmPassword;
  let pendingSubmit = false;

  //*********************MISC***********************/

  const blankString = "";

  //*************CONSTRAINT-VALIDATION*************//

  let errorTextEmail = blankString,
    errorTextPassword = blankString,
    errorTextConfirmPassword = blankString;

  let errorTextServer = blankString;

  $: {
    if (email !== blankString) {
      errorTextEmail = validateEmail(email);
    } else {
      //only display error messages when the corresponding input field isn't blank
      errorTextEmail = blankString;
    }
  }

  $: {
    if (password !== blankString) {
      errorTextPassword = validatePassword(password);
    } else {
      errorTextPassword = blankString;
    }
  }

  //included 'password' condition for the sake of triggering reactivity based on
  //changes to both confirmPassword and password
  $: {
    if (confirmPassword !== blankString && password !== blankString) {
      errorTextConfirmPassword = validateConfirmPassword(
        confirmPassword,
        password
      );
    } else {
      errorTextConfirmPassword = blankString;
    }
  }

  function clearErrorTextServer() {
    errorTextServer = blankString;
  }

  function clearErrorTextEmail() {
    errorTextEmail = blankString;
  }

  function clearErrorTextPassword() {
    errorTextPassword = blankString;
  }

  function clearErrorTextConfirmPassword() {
    errorTextConfirmPassword = blankString;
  }

  //**************BUTTON-DISABLED-FLAG**************//

  $: isButtonEnabled =
    email &&
    password &&
    confirmPassword &&
    !errorTextEmail &&
    !errorTextPassword &&
    !errorTextConfirmPassword &&
    !errorTextServer &&
    !pendingSubmit;

  //*****************FORM-SUBMISSION****************//

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true; //flag to prevent spamming requests for signing up

    let reqError;

    try {
      //will await the resolution of the promise for pendingSubmit flag execution order
      reqError = await handleSignupRequest(email, password, confirmPassword); //will handle changing auth state itself, and rerouting is based purely on auth state itself
    } catch (err) {
      console.error("sign-up submit error", err, err.stack);
    }

    if (reqError) {
      errorTextServer = reqError;
    }

    pendingSubmit = false;
  }
</script>

<div class="page sign-up">
  <form on:submit={onSubmit} novalidate>
    <p class="server-error-response">
      {errorTextServer}
    </p>

    <div class="input-container">
      <p class="input-error email">{errorTextEmail}</p>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        on:input={() => {
          clearErrorTextServer(); //always clear the server message when any input is altered
          clearErrorTextEmail();
        }}
        bind:value={email}
        disabled={pendingSubmit}
        required
      />
    </div>

    <div class="input-container">
      <p class="input-error password">{errorTextPassword}</p>
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        on:input={() => {
          clearErrorTextServer();
          clearErrorTextPassword();
        }}
        bind:value={password}
        disabled={pendingSubmit}
        required
      />
    </div>

    <div class="input-container">
      <p class="input-error confirm-password">{errorTextConfirmPassword}</p>
      <label for="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        on:input={() => {
          clearErrorTextServer();
          clearErrorTextConfirmPassword();
        }}
        bind:value={confirmPassword}
        disabled={pendingSubmit}
        required
      />
    </div>
    <button type="submit" disabled={!isButtonEnabled}>Sign up!</button>
  </form>
  <a class="page-redirect-link" href="/log-in">Existing User? Log in here!</a>
</div>

<style>
</style>
