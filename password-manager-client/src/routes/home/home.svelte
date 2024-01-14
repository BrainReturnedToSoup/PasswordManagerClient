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

  //page focus represents what is displayed as the main content corresponding
  //to the selected nav bar option

  import { primaryFocusEnums, secondaryFocusEnums } from "./pageFocusEnums";

  let primaryFocus = primaryFocusEnums.credentials,
    secondaryFocus = secondaryFocusEnums.credentials.main;

  function setFocus({ primary, secondary }) {
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

  //********BUTTON-SELECTION********/

  $: creatorSelected =
    secondaryFocus === secondaryFocusEnums.credentials.creator;

  $: accountSelected = secondaryFocus === secondaryFocusEnums.settings.account;

  $: preferencesSelected =
    secondaryFocus === secondaryFocusEnums.settings.preferences;

  $: faqSelected = secondaryFocus === secondaryFocusEnums.settings.faq;

  //****SETTINGS-SCROLL-POSITION****/

  //ensuring that the focus change based on clicking
  //the navigation emits to the settings component, and
  //not cause an infinite loop of updates.
  let scrolledFlag = false;

  const hasScrolled = {
    true: () => {
      scrolledFlag = true;
    },
    false: () => {
      scrolledFlag = false;
    },
  };

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
      <h1 class="censored-email">{censoredEmail}</h1>
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
            hasScrolled.false();
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
          hasScrolled.false();
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
          hasScrolled.false();
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
          hasScrolled.false();
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
          hasScrolled.false();
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
      <Credentials {secondaryFocus} {pendingLogout} />
    {:else if primaryFocus === primaryFocusEnums.settings}
      <!-- This 'Settings' component features bidirectional communication
      with this parent component so that when the focus changes from either the parent
      (clicking on a settings nav) or from the child (scrolling through the settings) both 
      parties remain in sync on their secondary focus-->
      <Settings {secondaryFocus} {pendingLogout} {hasScrolled} {setFocus} />
    {/if}
  </main>
</div>

<style>
  .selected {
    font-weight: 700;
  }
</style>
