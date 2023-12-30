<script>
  import { sendLoginRequest } from "../../lib/formSubmissionHandling";
  import { redirect } from "@sveltejs/kit";

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

  let isButtonEnabled = email && password && !errorTextServer && !pendingSubmit;

  //*****************FORM-SUBMISSION****************//

  async function onSubmit(e) {
    e.preventDefault();

    pendingSubmit = true; //flag to prevent spamming requests for signing up

    let res, error;

    try {
      res = await sendLoginRequest(email, password, confirmPassword);
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error("log-in submit error", error, error.stack);
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

<div class="page log-in">
  <form on:submit={onSubmit}>
    <div class="input-container">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        on:input={clearErrorTextServer}
        bind:value={email}
      />
    </div>

    <div class="input-container">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        on:input={clearErrorTextServer}
        bind:value={password}
      />
    </div>
    <button type="submit" disabled={!isButtonEnabled}>Log in!</button>
  </form>
  <a class="page-redirect-link" href="/sign-up">New user? Sign up here!</a>
</div>

<style>
</style>
