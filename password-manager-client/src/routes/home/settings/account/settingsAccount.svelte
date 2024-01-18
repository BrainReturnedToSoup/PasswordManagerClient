<script>
  //have to bind the container element in order to access it's offsetTop DOM api
  export let accountContainer;

  //for preventing certain functionalities that depend on a proper auth state
  export let pendingLogout;

  import DeleteAccount from "./deleteAccount.svelte";
  import NewPassword from "./newPassword.svelte";
  import VerifyEmail from "./verifyEmail.svelte";
</script>

<div bind:this={accountContainer} class="settings-account container">
  <h2 class="settings-account header">Account</h2>
  <DeleteAccount {pendingLogout} />
  <NewPassword {pendingLogout} />
  <VerifyEmail {pendingLogout} />
</div>

<style>
  .settings-account.container {
    height: 600px;
  }
</style>
