<script>
  //**********COMPONENTS***********/

  import Credentials from "./credentials/credentials.svelte";
  import Settings from "./settings/settings.svelte";

  //*********CENSORED-EMAIL********/

  import { currAuthEmailCensoredStore } from "../../lib/state/authState";
  import { onDestroy } from "svelte";

  let censoredEmail = "";

  const censoredEmailSubscription = currAuthEmailCensoredStore.subscribe(
    (state) => {
      censoredEmail = state;
    }
  );

  onDestroy(censoredEmailSubscription);

  //**********PAGE*FOCUS***********/

  import { primaryFocusEnums, secondaryFocusEnums } from "./pageFocusEnums";

  let primaryFocus = primaryFocusEnums.credentials,
    secondaryFocus = secondaryFocusEnums.credentials.main;

  function setFocus(primary, secondary) {
    if (
      primary in primaryFocusEnums &&
      secondary in secondaryFocusEnums[primary]
    ) {
      primaryFocus = primary;
      secondaryFocus = secondary;
    } else {
      primaryFocus = primaryFocusEnums.credentials;
      secondaryFocus = secondaryFocusEnums.credentials.main;
    }
  }

  //***********LOG-OUT-REQUEST*********/

  function handleLogout() {}
</script>

<div class="page home">
  <nav>
    <div class="profile container">
      <h1 class="censored-email">{censoredEmail}</h1>
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
          setFocus(
            primaryFocusEnums.credentials,
            secondaryFocusEnums.credentials.main
          );
        }}>Back to main</button
      >
    </div>

    <div class="settings container button">
      <h1 class="settings header">Settings</h1>
      <button
        class="settings account"
        on::click={() => {
          setFocus(
            primaryFocusEnums.settings,
            secondaryFocusEnums.settings.account
          );
        }}>Account</button
      >
      <button
        class="settings preferences button"
        on::click={() => {
          setFocus(
            primaryFocusEnums.settings,
            secondaryFocusEnums.settings.preferences
          );
        }}>Preferences</button
      >
      <button
        class="settings faq button"
        on::click={() => {
          setFocus(
            primaryFocusEnums.settings,
            secondaryFocusEnums.settings.faq
          );
        }}>FAQ</button
      >
    </div>

    <div class="credentials-creator container">
      <button
        class="credentials-creator button"
        on::click={() => {
          setFocus(
            primaryFocusEnums.credentials,
            secondaryFocusEnums.credentials.creator
          );
        }}>Add new credentials +</button
      >
    </div>
  </nav>
  <main>
    {#if primaryFocus === primaryFocusEnums.credentials}
      <Credentials {secondaryFocus} />
    {:else if primaryFocus === primaryFocusEnums.settings}
      <Settings {secondaryFocus} />
    {/if}
  </main>
</div>

<style>
</style>
