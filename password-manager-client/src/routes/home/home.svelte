<script>
  //**********COMPONENTS***********/

  import Credentials from "./credentials/credentials.svelte";
  import Settings from "./settings/settings.svelte";

  //*************STATE*************/

  //********PAGE*FOCUS*APIs*********/

  //define the focus of the home page corresponding to the selected
  //navigation button. The focus will change the content that exists
  //main based on what is selected. The nav bar should stay no matter the
  //specific focus state.

  //*********LOG-OUT-REQUEST********/

  //just for handling a simple logout request

  function handleLogout() {}
</script>

<div class="page home">
  <nav>
    <div class="profile container">
      <h1 class="email-censored"></h1>
      //will contain the value stored in the censored email store just for UI
      touches
      <button
        class="log-out"
        on::click={() => {
          handleLogout();
        }}>Log out</button
      >
    </div>

    <div class="credentials-main container">
      <button
        class="credentials-main button"
        on::click={() => {
          credentialsFocus(secondaryFocusEnums.credentialsMain);
        }}>Back to credentials</button
      >
    </div>

    <div class="settings container button">
      <button
        class="settings account"
        on::click={() => {
          settingsFocus(secondaryFocusEnums.settingsAccount);
        }}>Account</button
      >
      <button
        class="settings preferences button"
        on::click={() => {
          settingsFocus(secondaryFocusEnums.settingsPreferences);
        }}>Preferences</button
      >
      <button
        class="settings faq button"
        on::click={() => {
          settingsFocus(secondaryFocusEnums.settingsFaq);
        }}>FAQ</button
      >
    </div>

    <div class="credentials-creator container">
      <button
        class="credentials-creator button"
        on::click={() => {
          credentialsFocus(secondaryFocusEnums.credentialsCreator);
        }}>Add new credentials</button
      >
    </div>
  </nav>
  <main>
    {#if currentStoreVals.homePageFocusStore.main == mainFocusEnums.credentials}
      <Credentials secondary={currentStoreVals.homePageFocusStore.secondary} />
    {:else if currentStoreVals.homePageFocusStore.secondary == mainFocusEnums.settings}
      <Settings secondary={currentStoreVals.homePageFocusStore.secondary} />
    {/if}
  </main>
</div>

<style>
</style>
