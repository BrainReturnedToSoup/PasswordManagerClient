<script>
  import { handleLoginRequest } from "../../lib/formSubmissionHandling";

  //****************COMPONENT-STATE****************//

  let email, password;
  let pendingSubmit = false;

  //*********************MISC***********************/

  const blankString = "";

  //*************CONSTRAINT-VALIDATION*************//

  let errorTextServer = blankString;

  function clearErrorTextServer() {
    errorTextServer = blankString;
  }

  //**************BUTTON-DISABLED-FLAG**************//

  $: isButtonEnabled = email && password && !errorTextServer && !pendingSubmit;

  //*****************FORM-SUBMISSION****************//

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true; //flag to prevent spamming requests for signing up

    try {
      //will await the resolution of the promise for pendingSubmit flag execution order
      await handleLoginRequest(email, password); //will handle changing auth state itself, and rerouting is based purely on auth state itself
    } catch (error) {
      console.error("log-in submit error", error, error.stack);
    }

    pendingSubmit = false; //reset the request flag
  }
</script>

<div class="page log-in">
  <form on:submit={onSubmit}>
    <div class="input-container">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        on:input={clearErrorTextServer}
        bind:value={email}
        autocomplete="on"
      />
    </div>

    <div class="input-container">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        on:input={clearErrorTextServer}
        bind:value={password}
        autocomplete="on"
      />
    </div>
    <button type="submit" disabled={!isButtonEnabled}>Log in!</button>
  </form>
  <a class="page-redirect-link" href="/sign-up">New user? Sign up here!</a>
</div>

<style>
</style>
