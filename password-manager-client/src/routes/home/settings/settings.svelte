<script>
  //**********PROPS***********/

  //the setFocus api as part of the parent element, which is important for
  //ensuring the parent component is in sync with scrolling through the
  //settings container
  export let setFocus;

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

  import { primaryFocusEnums, secondaryFocusEnums } from "../pageFocusEnums";

  let settingsContainer, accountComponent, preferencesComponent, faqComponent;

  function updateSecondaryFocus() {
    if (
      !settingsContainer ||
      !accountComponent ||
      !preferencesComponent ||
      !faqComponent
    ) {
      return; //defensive return just in case if a component isn't initialized
    }

    const scrollTop = settingsContainer.scrollTop;
    const offsetTop = {
      account: accountComponent.offsetTop,
      preferences: preferencesComponent.offsetTop,
      faq: faqComponent.offsetTop,
    };

    if (scrollTop >= 0 && scrollTop < offsetTop.preferences) {
      //account section in view, set the parent to such
      hasScrolled.true();
      setFocus({
        primary: primaryFocusEnums.settings,
        secondary: secondaryFocusEnums.settings.account,
      });
    } else if (
      scrollTop > offsetTop.account &&
      scrollTop <= offsetTop.preferences
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

  //****SET-SECONDARY-FOCUS****/

  export function scrollToSubsection(secondaryFocus) {
    //used to set the secondary focus of settings, which involves
    //scrolling to the corresponding subsection
    if (
      !settingsContainer ||
      !accountComponent ||
      !preferencesComponent ||
      !faqComponent
    ) {
      return; //defensive return just in case if a component isn't initialized
    }

    const offsetTop = {
      account: accountComponent.offsetTop,
      preferences: preferencesComponent.offsetTop,
      faq: faqComponent.offsetTop,
    };

    settingsContainer.scrollTop = offsetTop[secondaryFocus]; //instantly jumps the scroll to the desired subsection
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
</style>
