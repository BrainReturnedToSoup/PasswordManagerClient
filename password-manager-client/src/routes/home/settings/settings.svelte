<script>
  //**********PROPS***********/

  export let setFocus;

  //prevent functionalities that may depend on proper auth,
  //hence you don't want to have such work in the event of a logout attempt
  export let pendingLogout;

  //********COMPONENTS********/

  import SettingsAccount from "./settingsAccount.svelte";
  import SettingsPreferences from "./settingsPreferences.svelte";
  import SettingsFaq from "./settingsFaq.svelte";

  //*******SETTING-STATE******/

  import {
    settingsSecondaryFocusStore,
    settingsHasScrolledStore,
  } from "../../../lib/state/settingsState";
  import { onDestroy } from "svelte";

  const stores = {
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

  //*******SCROLL-POSITION****/

  import { primaryFocusEnums, secondaryFocusEnums } from "../pageFocusEnums";
  import { tick } from "svelte";

  let settingsContainer, accountContainer, preferencesContainer, faqContainer;

  //syncs the scroll position to match the secondary focus in the store
  //only does so if the storeVal update isn't due to manually scrolling
  $: if (!storeVals.settingsHasScrolledStore) {
    syncSecondaryFocus();
  }

  async function syncSecondaryFocus() {
    await tick(); //ensures the components are properly mounted

    if (
      !settingsContainer ||
      !accountContainer ||
      !preferencesContainer ||
      !faqContainer
    ) {
      return;
    }

    const offsetTop = {
      [secondaryFocusEnums.settings.account]: accountContainer.offsetTop,
      [secondaryFocusEnums.settings.preferences]:
        preferencesContainer.offsetTop,
      [secondaryFocusEnums.settings.faq]: faqContainer.offsetTop,
    };

    settingsContainer.scrollTop =
      offsetTop[storeVals.settingsSecondaryFocusStore] -
      offsetTop[secondaryFocusEnums.settings.account];
  }

  async function handleScroll() {
    await tick();

    if (
      !settingsContainer ||
      !accountContainer ||
      !preferencesContainer ||
      !faqContainer
    ) {
      return; //defensive return just in case if a component isn't initialized
    }

    const { scrollTop } = settingsContainer;
    const offsetTop = {
      [secondaryFocusEnums.settings.account]: accountContainer.offsetTop,
      [secondaryFocusEnums.settings.preferences]:
        preferencesContainer.offsetTop,
      [secondaryFocusEnums.settings.faq]: faqContainer.offsetTop,
    };

    //flag to prevent reduntant updatesthat propagate back to this component
    stores.settingsHasScrolledStore.true();

    if (
      scrollTop >= 0 &&
      scrollTop < offsetTop[secondaryFocusEnums.settings.account]
    ) {
      //account section in view, set the parent to such
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.account,
      });
    } else if (
      scrollTop > offsetTop[secondaryFocusEnums.settings.account] &&
      scrollTop <= offsetTop[secondaryFocusEnums.settings.preferences]
    ) {
      //preferences section in view, set the parent to such
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.preferences,
      });
    } else {
      //faq section in view, set the parent to such
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.faq,
      });
    }
  }
</script>

<div
  on:scroll={handleScroll}
  bind:this={settingsContainer}
  class="settings container"
>
  <SettingsAccount bind:accountContainer {pendingLogout} />
  <SettingsPreferences bind:preferencesContainer {pendingLogout} />
  <SettingsFaq bind:faqContainer {pendingLogout} />
</div>

<style>
  .settings.container {
    overflow-y: scroll;
    height: 500px;
  }
</style>
