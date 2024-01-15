<script>
  //**********COMPONENTS***********/

  import Credentials from "./credentials/credentials.svelte";
  import Settings from "./settings/settings.svelte";

  //********ERROR-MESSAGES*********/

  const blankString = "";
  let errorMessage = blankString;

  //**********HOME-STATE***********/

  import { primaryFocusEnums, secondaryFocusEnums } from "./pageFocusEnums";

  import {
    settingsSecondaryFocusStore,
    settingsHasScrolledStore,
  } from "../../lib/state/settingsState";
  import { currAuthEmailCensoredStore } from "../../lib/state/authState";
  import { onDestroy } from "svelte";

  const stores = {
    currAuthEmailCensoredStore,
    settingsSecondaryFocusStore,
    settingsHasScrolledStore,
  }; //for property name reuse

  const subscriptions = {};
  let storeVals = {}; //reactive, as it contains the actual values of the store states

  //for initializing the subscription instances, and ensuring proper cleanup
  for (const [name, store] of Object.entries(stores)) {
    subscriptions[name] = store.subscribe((state) => {
      const clone = { ...storeVals };
      clone[name] = state;
      storeVals = clone; //to activate reactivity on change
    });

    onDestroy(subscriptions[name]); //ensure to unsubscribe on component destruction
  }

  //local focus management
  let primaryFocus = primaryFocusEnums.credentials,
    secondaryFocus = secondaryFocusEnums.credentials.main;

  function setFocus({ primary, secondary }) {
    if (
      primary in primaryFocusEnums &&
      secondary in secondaryFocusEnums[primary]
    ) {
      primaryFocus = primary;
      secondaryFocus = secondary;
    } else {
      throw new Error(
        "Invalid setFocus args",
        `Primary: ${primary} Secondary: ${secondary}`
      );
    }
  }

  //if a focus change is within settings, and the cause isn't caused by
  //a scroll within the settings page
  $: if (
    primaryFocus === primaryFocusEnums.settings &&
    !storeVals.settingsHasScrolledStore
  ) {
    stores.settingsSecondaryFocusStore[secondaryFocus]();
  }

  //********BUTTON-SELECTION********/

  $: creatorSelected =
    secondaryFocus === secondaryFocusEnums.credentials.creator;

  $: accountSelected = secondaryFocus === secondaryFocusEnums.settings.account;

  $: preferencesSelected =
    secondaryFocus === secondaryFocusEnums.settings.preferences;

  $: faqSelected = secondaryFocus === secondaryFocusEnums.settings.faq;

  //************LOG-OUT*************/

  import {
    authStateStore,
    redirectToLoginStore,
  } from "../../lib/state/authState";

  const twoSecondDelay = 2000;
  let pendingLogout = false,
    logoutError = false;

  function logoutErrorFlagReset() {
    logoutError = true;
    setTimeout(() => {
      logoutError = false;
    }, twoSecondDelay);
  }

  async function handleLogout() {
    pendingLogout = true;

    let logoutResult, error;

    try {
      //will delete the session associated with the supplied cookie,
      //clear the jwt cookie, and send a sucess flag
      const res = await fetch("/log-out", { method: "POST" });
      logoutResult = await res.json();
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error("handleLogout: ", error, error.stack);
      errorMessage = `Fatal ${error}`;
      logoutErrorFlagReset();
    } else if (logoutResult.success) {
      errorMessage = blankString;
      authStateStore.authedFalse();
      redirectToLoginStore.true();
      //will have logged out thus you don't want to make a redundant
      //auth check on the login page when it mounts
    } else {
      errorMessage = logoutResult.error;
      logoutErrorFlagReset();
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
      <h1 class="censored-email">{storeVals.currAuthEmailCensoredStore}</h1>
      <button
        class="log-out"
        disabled={pendingLogout || logoutError}
        on:click={handleLogout}>Log out</button
      >
    </div>

    <div class="credentials-main button container">
      <!-- Only render the back to main button if you are not on main-->
      {#if secondaryFocus !== secondaryFocusEnums.credentials.main}
        <button
          class="credentials-main button"
          disabled={pendingLogout}
          on:click={() => {
            stores.settingsHasScrolledStore.false();
            setFocus({
              primary: primaryFocusEnums.credentials,
              secondary: secondaryFocusEnums.credentials.main,
            });
          }}>Back to main</button
        >
      {/if}
    </div>

    <div class="credentials-creator button container">
      <button
        class="credentials-creator button"
        class:selected={creatorSelected}
        disabled={pendingLogout}
        on:click={() => {
          stores.settingsHasScrolledStore.false();
          setFocus({
            primary: primaryFocusEnums.credentials,
            secondary: secondaryFocusEnums.credentials.creator,
          });
        }}>New Credentials+</button
      >
    </div>

    <div class="settings-button container">
      <h1 class="settings header">Settings</h1>
      <button
        class="settings-account button"
        class:selected={accountSelected}
        disabled={pendingLogout}
        on:click={() => {
          stores.settingsHasScrolledStore.false();
          setFocus({
            primary: primaryFocusEnums.settings,
            secondary: secondaryFocusEnums.settings.account,
          });
        }}>Account</button
      >
      <button
        class="settings-preferences button"
        class:selected={preferencesSelected}
        disabled={pendingLogout}
        on:click={() => {
          stores.settingsHasScrolledStore.false();
          setFocus({
            primary: primaryFocusEnums.settings,
            secondary: secondaryFocusEnums.settings.preferences,
          });
        }}>Preferences</button
      >
      <button
        class="settings-faq button"
        class:selected={faqSelected}
        disabled={pendingLogout}
        on:click={() => {
          stores.settingsHasScrolledStore.false();
          setFocus({
            primary: primaryFocusEnums.settings,
            secondary: secondaryFocusEnums.settings.faq,
          });
        }}>FAQ</button
      >
    </div>
  </nav>
  <main>
    {#if primaryFocus === primaryFocusEnums.credentials}
      <Credentials {pendingLogout} />
    {:else if primaryFocus === primaryFocusEnums.settings}
      <!-- This 'Settings' component features bidirectional communication
      with this parent component so that when the focus changes from either the parent
      (clicking on a settings nav) or from the child (scrolling through the settings) both 
      parties remain in sync on their secondary focus-->
      <Settings {pendingLogout} {setFocus} />
    {/if}
  </main>
</div>

<style>
  .selected {
    font-weight: 700;
  }
</style>
