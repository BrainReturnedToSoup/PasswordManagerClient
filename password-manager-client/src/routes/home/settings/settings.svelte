<script>
  //**********PROPS***********/

  //will be used to define what content it contains, as is per the sub categories of the
  //settings selection
  export let secondaryFocus;

  //prevent functionalities that may depend on proper auth,
  //hence you don't want to have such work in the event of a logout attempt
  export let pendingLogout;

  //********PAGE-FOCUS********/

  import { secondaryFocusEnums } from ".././pageFocusEnums";
</script>

<div class="settings container"></div>

<style>
</style>
