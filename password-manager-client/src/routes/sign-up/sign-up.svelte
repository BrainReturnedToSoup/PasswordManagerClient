<script>
  //returns validation error messages based on whether the supplied
  //inputs are valid or not
  import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  } from "../../lib/constraintValidation";

  import { sendSignupRequest } from "../../lib/formSubmissionHandling";
  import { redirect } from "@sveltejs/kit";

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

  let isButtonEnabled =
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

    let res, error;

    try {
      res = await sendSignupRequest(email, password, confirmPassword);
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error("sign-up submit error", error, error.stack);
    } else if (res.valid) {
      //if valid, the server already added the auth token in the cookies
      //redirect to home automatically
      redirect("/home");
    } else {
      errorTextServer = res.message;
    }

    pendingSubmit = false; //reset the request flag at the end of the promise
  }
</script>

<div class="page sign-up">
  <form on:submit={onSubmit}>
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
      />
    </div>
    <button type="submit" disabled={!isButtonEnabled}>Sign up!</button>
  </form>
  <a class="page-redirect-link" href="/log-in">Existing User? Log in here!</a>
</div>

<style>
</style>
