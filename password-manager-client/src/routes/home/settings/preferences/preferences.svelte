<script>
  //have to bind the container element in order to access it's offsetTop DOM api
  export let preferencesContainer;
</script>

<div bind:this={preferencesContainer} class="settings-preferences container">
  <h2 class="settings-preferences header">Preferences</h2>
  <div class="settings-preferences general container"></div>
  <div class="settings-preferences theme container"></div>
  <div class="settings-preferences font container"></div>
</div>

<style>
  .settings-preferences.container {
    height: 600px;
  }
</style>
