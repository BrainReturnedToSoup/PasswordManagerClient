<script>
  //****************BINDED-INPUTS******************//

  let email, password, confirmPassword;

  //*************CONSTRAINT-VALIDATION*************//

  import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  } from "../../lib/utils/constraintValidation";

  let errorTextEmail = "",
    errorTextPassword = "",
    errorTextConfirmPassword = "",
    errorTextServer = "";

  $: {
    if (email !== "") {
      errorTextEmail = validateEmail(email);
    } else {
      errorTextEmail = ""; //only display error messages when the corresponding input field isn't blank
    }
  }

  $: {
    if (password !== "") {
      errorTextPassword = validatePassword(password);
    } else {
      errorTextPassword = "";
    }
  }

  //included 'password' condition for the sake of triggering reactivity based on
  //changes to password as well, not just confirmPassword
  $: {
    if (confirmPassword !== "" && password !== "") {
      errorTextConfirmPassword = validateConfirmPassword(
        confirmPassword,
        password
      );
    } else {
      errorTextConfirmPassword = "";
    }
  }

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
      errorTextServer = result.error; //an error occured somewhere in the request lifecycle (client and server)
    } else {
      redirectToHomeStore.true(); //otherwise mean the use is authed from the successful login, or from the existing token in cookies.
      authStateStore.authedTrue();
    }

    pendingSubmit = false; //reset the request flag
  }

  //*****************ON-INPUT************************/

  //for clearing the server error text and the corresponding error
  //text to the specific input upon input change
  const onInput = {
    email: () => {
      errorTextServer = "";
      errorTextEmail = "";
    },

    password: () => {
      errorTextServer = "";
      errorTextPassword = "";
    },

    confirmPassword: () => {
      errorTextServer = "";
      errorTextConfirmPassword = "";
    },
  };

  //*************SUBMIT-BUTTON-ENABLED**************//

  $: submitButtonEnabled =
    email &&
    password &&
    confirmPassword &&
    !errorTextEmail &&
    !errorTextPassword &&
    !errorTextConfirmPassword &&
    !errorTextServer &&
    !pendingSubmit;
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
        on:input={onInput.email}
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
        on:input={onInput.password}
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
        on:input={onInput.confirmPassword}
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
