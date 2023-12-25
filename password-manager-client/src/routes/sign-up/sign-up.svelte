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

  //*************CONSTRAINT-VALIDATION*************//

  const blankString = "";

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

  //************BUTTON-DISABLED-ATR-FLAG************//

  let allValidInputs =
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

    pendingSubmit = false; //reset the request flag
  }
</script>

<div class="page sign-up">
  <form on:submit={onSubmit}>
    <div class="input-container">
      <p class="input-error email">{errorTextEmail}</p>
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} />
    </div>

    <div class="input-container">
      <p class="input-error password">{errorTextPassword}</p>
      <label for="password">Password</label>
      <input id="password" type="password" bind:value={password} />
    </div>

    <div class="input-container">
      <p class="input-error confirm-password">{errorTextConfirmPassword}</p>
      <label for="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        bind:value={confirmPassword}
      />
    </div>
    <button disabled={allValidInputs}>Sign up!</button>
  </form>
</div>

<style>
</style>
