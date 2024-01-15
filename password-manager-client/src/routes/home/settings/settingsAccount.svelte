<script>
  export let accountContainer;
  export let pendingLogout;
</script>

<div bind:this={accountContainer} class="settings-account container">
  <h2 class="settings-account header">Account</h2>
</div>

<style>
  .settings-account.container {
    height: 600px;
  }
</style>
