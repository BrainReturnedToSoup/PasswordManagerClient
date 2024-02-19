<script>
  //****************BINDED-INPUTS******************//

  let email, password;

  //*****************FORM-SUBMISSION***************//

  import { redirectToHomeStore } from "../../lib/state/auth/redirect";
  import { authStateStore } from "../../lib/state/auth/auth";
  import authApis from "../../lib/requestAPIs/auth";

  let pendingSubmit = false;

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true; //flag to prevent spamming requests for signing up

    //will await the resolution of the promise for pendingSubmit flag execution order
    const result = await authApis.post.login(email, password); //will handle changing auth state itself, and rerouting is based purely on auth state itself

    if (!result.success && !result.auth) {
      errorTextServer = result.error; //an error occured somewhere in the request lifecycle (client and server)
    } else {
      redirectToHomeStore.true(); //otherwise mean the use is authed from the successful login, or from the existing token in cookies.
      authStateStore.authedTrue();
    }

    pendingSubmit = false; //reset the request flag
  }

  //*****************SERVER-ERROR*******************/

  let errorTextServer = "";

  const onInput = {
    clearMessage: () => {
      errorTextServer = "";
    },
  };

  //*************SUBMIT-BUTTON-ENABLED*************//

  $: submitButtonEnabled =
    email && password && !errorTextServer && !pendingSubmit;
</script>

<div class="page log-in">
  <form on:submit={onSubmit} novalidate>
    {#if errorTextServer}
      <p class="server-error-response">
        {errorTextServer}
      </p>
    {/if}

    <div class="input-container">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        on:input={onInput.clearMessage}
        bind:value={email}
        autocomplete="on"
        disabled={pendingSubmit}
        required
      />
    </div>

    <div class="input-container">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        on:input={onInput.clearMessage}
        bind:value={password}
        autocomplete="on"
        disabled={pendingSubmit}
        required
      />
    </div>

    <button type="submit" disabled={!submitButtonEnabled}>Log in!</button>
  </form>
  <a class="page-redirect-link" href="/sign-up">New user? Sign up here!</a>
</div>

<style>
</style>
