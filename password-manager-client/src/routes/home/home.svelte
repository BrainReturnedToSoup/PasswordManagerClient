<script>
  //**********COMPONENTS***********/

  import Credentials from "./credentials/credentials.svelte";
  import Settings from "./settings/settings.svelte";

  //********ERROR-MESSAGES*********/

  const blankString = "";
  let errorMessage = blankString;

  //*********CENSORED-EMAIL********/

  import { currAuthEmailCensoredStore } from "../../lib/state/authState";
  import { onDestroy } from "svelte";

  let censoredEmail = blankString;

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
      //only if both arguments are valid values to use
      primaryFocus = primary;
      secondaryFocus = secondary;
    } else {
      primaryFocus = primaryFocusEnums.credentials;
      secondaryFocus = secondaryFocusEnums.credentials.main;
    }
  }

  //************LOG-OUT*************/

  import {
    authStateStore,
    redirectToLoginStore,
  } from "../../lib/state/authState";

  const twoSecondDelay = 2000;
  let pendingLogout = false,
    logoutError = false;

  function logoutErrorDelay() {
    logoutError = true;
    setTimeout(() => {
      logoutError = false;
    }, twoSecondDelay);
  }

  async function handleLogout() {
    pendingLogout = true;

    let logoutResult, error;

    try {
      logoutResult = await fetch("/log-out", { method: "POST" });
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error("handleLogout: ", error, error.stack);
      errorMessage = `Fatal ${error}`;
      logoutErrorDelay();
    } else if (logoutResult.success) {
      errorMessage = blankString;
      authStateStore.authedFalse();
      redirectToLoginStore.true();
      //will have logged out thus you don't want to make a redundant
      //auth check on the login page when it mounts
    } else {
      errorMessage = logoutResult.error;
      logoutErrorDelay();
    }

    pendingLogout = false;
  }
</script>

<div class="page home">
  <div class="error-message container">
    {#if errorMessage}
      <p class="error-message">
        {errorMessage}
      </p>
    {/if}
  </div>

  <nav>
    <div class="profile container">
      <h1 class="censored-email">{censoredEmail}</h1>
      <button
        class="log-out"
        on::click={() => {
          handleLogout();
        }}
        disabled={pendingLogout || logoutError}>Log out</button
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
        }}
        disabled={pendingLogout}>Back to main</button
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
        }}
        disabled={pendingLogout}>Account</button
      >
      <button
        class="settings preferences button"
        on::click={() => {
          setFocus(
            primaryFocusEnums.settings,
            secondaryFocusEnums.settings.preferences
          );
        }}
        disabled={pendingLogout}>Preferences</button
      >
      <button
        class="settings faq button"
        on::click={() => {
          setFocus(
            primaryFocusEnums.settings,
            secondaryFocusEnums.settings.faq
          );
        }}
        disabled={pendingLogout}>FAQ</button
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
        }}
        disabled={pendingLogout}>Add new credentials +</button
      >
    </div>
  </nav>
  <main>
    {#if primaryFocus === primaryFocusEnums.credentials}
      <Credentials {secondaryFocus} {pendingLogout} />
    {:else if primaryFocus === primaryFocusEnums.settings}
      <Settings {secondaryFocus} {pendingLogout} />
    {/if}
  </main>
</div>

<style>
</style>
