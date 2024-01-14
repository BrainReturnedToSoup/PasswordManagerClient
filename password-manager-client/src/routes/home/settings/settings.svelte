<script>
  //**********PROPS***********/

  //the setFocus api as part of the parent element, which is important for
  //ensuring the parent component is in sync with scrolling through the
  //settings container
  export let setFocus;

  //for defining essentially the scroll position to display the target
  //secondary focus within settings
  export let secondaryFocus;

  //ensuring that the focus change based on clicking
  //the navigation emits to the settings component, and
  //not cause an infinite loop of updates.
  export let hasScrolled;

  //prevent functionalities that may depend on proper auth,
  //hence you don't want to have such work in the event of a logout attempt
  export let pendingLogout;

  //********COMPONENTS********/

  import SettingsAccount from "./settingsAccount.svelte";
  import SettingsPreferences from "./settingsPreferences.svelte";
  import SettingsFaq from "./settingsFaq.svelte";

  //*******SCROLL-POSITION****/

  import { onMount } from "svelte";
  import { primaryFocusEnums, secondaryFocusEnums } from "../pageFocusEnums";

  let settingsContainer, accountComponent, preferencesComponent, faqComponent;

  //sets the initial scroll position based on the supplied secondary focus prop
  onMount(initPropBasedSecondaryFocus);

  function initPropBasedSecondaryFocus() {
    if (
      !settingsContainer ||
      !accountComponent ||
      !preferencesComponent ||
      !faqComponent
    ) {
      throw new Error(
        "Settings secondary focus components failed to initialize on parent Settings component mount"
      );
    }

    const offsetTop = {
      [secondaryFocusEnums.settings.account]: accountComponent.offsetTop,
      [secondaryFocusEnums.settings.preferences]:
        preferencesComponent.offsetTop,
      [secondaryFocusEnums.settings.faq]: faqComponent.offsetTop,
    };

    settingsContainer.scrollTop = offsetTop[secondaryFocus];
  }

  function updateSecondaryFocus() {
    if (
      !settingsContainer ||
      !accountComponent ||
      !preferencesComponent ||
      !faqComponent
    ) {
      return; //defensive return just in case if a component isn't initialized
    }

    const { scrollTop } = settingsContainer;
    const offsetTop = {
      [secondaryFocusEnums.settings.account]: accountComponent.offsetTop,
      [secondaryFocusEnums.settings.preferences]:
        preferencesComponent.offsetTop,
      [secondaryFocusEnums.settings.faq]: faqComponent.offsetTop,
    };

    if (
      scrollTop >= 0 &&
      scrollTop < offsetTop[secondaryFocusEnums.settings.account]
    ) {
      //account section in view, set the parent to such
      hasScrolled.true();
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.account,
      });
    } else if (
      scrollTop > offsetTop[secondaryFocusEnums.settings.account] &&
      scrollTop <= offsetTop[secondaryFocusEnums.settings.preferences]
    ) {
      //preferences section in view, set the parent to such
      hasScrolled.true();
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.preferences,
      });
    } else {
      //faq section in view, set the parent to such
      hasScrolled.true();
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.faq,
      });
    }
  }
</script>

<div
  on:scroll={updateSecondaryFocus}
  bind:this={settingsContainer}
  class="settings container"
>
  <SettingsAccount bind:this={accountComponent} {pendingLogout} />
  <SettingsPreferences bind:this={preferencesComponent} {pendingLogout} />
  <SettingsFaq bind:this={faqComponent} {pendingLogout} />
</div>

<style>
  .settings.container {
    overflow-y: scroll;
  }
</style>
