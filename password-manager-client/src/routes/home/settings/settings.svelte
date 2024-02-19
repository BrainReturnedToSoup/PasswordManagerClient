<script>
  //********COMPONENTS********/

  import Account from "./account/account.svelte";
  import Preferences from "./preferences/preferences.svelte";
  import Faq from "./faq/settingsFaq.svelte";

  //*******SETTING-STATE******/

  import { onDestroy } from "svelte";
  import { settingsNavClickedStore } from "../../../lib/state/home/settings";
  import {
    primaryFocusStore,
    secondaryFocusStore,
  } from "../../../lib/state/home/focus";

  const stores = {
    primaryFocusStore,
    secondaryFocusStore,
    settingsNavClickedStore,
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

  //*****SCROLL-POSITION******/

  import { tick } from "svelte";
  import { secondaryFocusEnums } from "../pageFocusEnums";

  //holds the reference to the corresponding HTML, hence their DOM APIs can be used
  let settingsContainer, accountContainer, preferencesContainer, faqContainer;

  //for syncing the scroll position to the secondary focus defined by clicking a settings nav button
  $: if (storeVals.settingsNavClickedStore) {
    syncPosition();
  }

  async function syncPosition() {
    await tick(); //ensures the components are properly mounted

    const offsets = {
      [secondaryFocusEnums.settings.account]: accountContainer.offsetTop,
      [secondaryFocusEnums.settings.preferences]:
        preferencesContainer.offsetTop,
      [secondaryFocusEnums.settings.faq]: faqContainer.offsetTop,
    };

    //set the scroll top position to which ever container is represented by the current secondary focus
    settingsContainer.scrollTop =
      offsets[storeVals.secondaryFocusStore] -
      offsets[secondaryFocusEnums.settings.account]; //subtract the difference to account for content container shift;

    await tick(); //wait for the scroll view to reach the newly defined scroll top before setting the clicked store to false

    settingsNavClickedStore.false(); //this flag ensures that clicks on the settings nav does not trigger the on scroll update
  }

  async function onScroll() {
    if (storeVals.settingsNavClickedStore) {
      return; //do not process on scroll events caused from a sync operation
    }

    await tick(); //ensures the components are properly mounted

    const { scrollTop } = settingsContainer;

    if (scrollTop >= 0 && scrollTop < accountContainer.offsetTop) {
      secondaryFocusStore.settings.account(); //account section in view, update focus in parent
    } else if (
      scrollTop > accountContainer.offsetTop &&
      scrollTop <= preferencesContainer.offsetTop
    ) {
      secondaryFocusStore.settings.preferences(); //preferences section in view, update focus in parent
    } else {
      secondaryFocusStore.settings.faq(); //faq section in view (The bottom), update focus in parent
    }
  }
</script>

<div
  on:scroll={onScroll}
  bind:this={settingsContainer}
  class="settings container"
>
  <Account bind:accountContainer />
  <Preferences bind:preferencesContainer />
  <Faq bind:faqContainer />
</div>

<style>
  .settings.container {
    overflow-y: scroll;
    scroll-behavior: smooth;
    height: 600px;
  }
</style>
