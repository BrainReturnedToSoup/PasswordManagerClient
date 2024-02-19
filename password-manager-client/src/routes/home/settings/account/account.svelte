<script>
  //************PROPS****************/
  //have to bind the container element in order to access it's offsetTop DOM api
  export let accountContainer;

  //**********COMPONENTS*************/

  import DeleteAccount from "./deleteAccount.svelte";
  import NewPassword from "./newPassword.svelte";
  import NewEmail from "./newEmail.svelte";
  import VerifyEmail from "./verifyEmail.svelte";
</script>

<div bind:this={accountContainer} class="settings-account container">
  <h2 class="settings-account header">Account</h2>
  <DeleteAccount />
  <NewPassword />
  <NewEmail />
  <VerifyEmail />
</div>

<style>
  .settings-account.container {
    height: 800px;
  }
</style>
