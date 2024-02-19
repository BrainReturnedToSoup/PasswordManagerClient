<script>
  //**********COMPONENTS***********/

  import Credentials from "./credentials/credentials.svelte";
  import Settings from "./settings/settings.svelte";
  import Error from "./error/error.svelte";

  //************ENUMS**************/

  import { primaryFocusEnums, secondaryFocusEnums } from "./pageFocusEnums";

  //*********STORE-VALUES**********/

  import { onDestroy } from "svelte";
  import { disableButtonStateStore } from "../../lib/state/home/disableButton";
  import { settingsNavClickedStore } from "../../lib/state/home/settings";
  import { errorMessageStore } from "../../lib/state/home/error";
  import {
    primaryFocusStore,
    secondaryFocusStore,
  } from "../../lib/state/home/focus";

  const stores = {
    primaryFocusStore,
    secondaryFocusStore,
    errorMessageStore,
    disableButtonStateStore,
  }; //for property name reuse
  let storeVals = {}; //reactive, as it contains the actual values of the store states

  //for initializing the subscription instances, and ensuring proper cleanup
  for (const [name, store] of Object.entries(stores)) {
    const unsubscribe = store.subscribe((state) => {
      const clone = { ...storeVals };
      clone[name] = state;
      storeVals = clone; //to activate reactivity on change
    });

    onDestroy(unsubscribe); //ensure to unsubscribe on component destruction
  }

  //****NAV-BUTTON-SELECTION-FLAG****/

  $: selected = {
    creator:
      storeVals.secondaryFocusStore === secondaryFocusEnums.credentials.creator,

    account:
      storeVals.secondaryFocusStore === secondaryFocusEnums.settings.account,

    preferences:
      storeVals.secondaryFocusStore ===
      secondaryFocusEnums.settings.preferences,

    faq: storeVals.secondaryFocusStore === secondaryFocusEnums.settings.faq,
  };

  //************LOGOUT***************/

  import { redirectToLoginStore } from "../../lib/state/auth/redirect";
  import { authStateStore } from "../../lib/state/auth/auth";
  import authApis from "../../lib/requestAPIs/auth";

  let pendingLogout = false,
    logoutDisabled = false;

  async function handleLogout() {
    pendingLogout = true;

    const result = await authApis.post.logout();

    if (!result.success && !("auth" in result)) {
      errorMessageStore.set(result.error); //an actual error occurred
      logoutDisabledDelay();
    } else {
      redirectToLoginStore.true(); //either worked or session already expired
      authStateStore.authedFalse();
    }

    pendingLogout = false;
  }

  function logoutDisabledDelay(delayMs = 2000) {
    logoutDisabled = true;

    setTimeout(() => {
      logoutDisabled = false;
    }, delayMs);
  }

  //************ON-CLICK*************/

  //on click lifecycles for present buttons
  const navClick = {
    credentials: {
      main: () => {
        primaryFocusStore.credentials();
        secondaryFocusStore.credentials.main();
      },
      creator: () => {
        primaryFocusStore.credentials();
        secondaryFocusStore.credentials.creator();
      },
    },

    settings: {
      account: () => {
        settingsNavClickedStore.true();
        primaryFocusStore.settings();
        secondaryFocusStore.settings.account();
      },
      preferences: () => {
        settingsNavClickedStore.true();
        primaryFocusStore.settings();
        secondaryFocusStore.settings.preferences();
      },
      faq: () => {
        settingsNavClickedStore.true();
        primaryFocusStore.settings();
        secondaryFocusStore.settings.faq();
      },
    },
  };

  //********UPDATER-LIFECYCLE********/

  import { updaterStateStore } from "../../lib/state/home/updater";

  $: if (
    storeVals.secondaryFocusStore !== secondaryFocusEnums.credentials.updater
  ) {
    updaterStateStore.clear(); //if the user is not on the updater, then ensure that it does not contain any past credential information
  }
</script>

<div class="page home">
  <!-- Will render based on the existence of an error message in the error message store. -->
  <Error />

  <nav>
    <div class="profile container">
      <!-- ADD EMAIL FROM USER STORE -->
      <!-- <h1 class="censored-email">{}</h1>  -->

      <button
        class="log-out"
        disabled={pendingLogout || logoutDisabled}
        on:click={handleLogout}>Log out</button
      >
    </div>

    <div class="credentials-main button container">
      <!-- Only render the back to main button if you are not on main-->
      {#if storeVals.secondaryFocusStore !== secondaryFocusEnums.credentials.main}
        <button
          class="credentials-main button"
          disabled={storeVals.disableButtonStateStore}
          on:click={navClick.credentials.main}>Back to main</button
        >
      {/if}
    </div>

    <div class="credentials-creator button container">
      <button
        class="credentials-creator button"
        class:selected={selected.creator}
        disabled={storeVals.disableButtonStateStore}
        on:click={navClick.credentials.creator}>New Credentials</button
      >
    </div>

    <div class="settings-button container">
      <h1 class="settings header">Settings</h1>

      <button
        class="settings-account button"
        class:selected={selected.account}
        disabled={storeVals.disableButtonStateStore}
        on:click={navClick.settings.account}>Account</button
      >

      <button
        class="settings-preferences button"
        class:selected={selected.preferences}
        disabled={storeVals.disableButtonStateStore}
        on:click={navClick.settings.preferences}>Preferences</button
      >

      <button
        class="settings-faq button"
        class:selected={selected.faq}
        disabled={storeVals.disableButtonStateStore}
        on:click={navClick.settings.faq}>FAQ</button
      >
    </div>
  </nav>
  <main>
    {#if storeVals.primaryFocusStore === primaryFocusEnums.settings}
      <Settings /> <!-- scroll position will match the button highlight -->
    {:else if storeVals.primaryFocusStore === primaryFocusEnums.credentials}
      <Credentials />
    {/if}
  </main>
</div>

<style>
  .selected {
    font-weight: 700;
  }
</style>
