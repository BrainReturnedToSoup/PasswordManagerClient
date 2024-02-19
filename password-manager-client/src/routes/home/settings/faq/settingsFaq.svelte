<script>
  //have to bind the container element in order to access it's offsetTop DOM api
  export let faqContainer;
</script>

<div bind:this={faqContainer} class="settings-faq container">
  <h2 class="settings-faq header">FAQ</h2>
  <div class="settings-faq about container"></div>
  <div class="settings-faq is-it-safe container"></div>
</div>

<style>
  .settings-faq.container {
    height: 600px;
  }
</style>
