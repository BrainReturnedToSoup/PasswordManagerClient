<script>
  //**********PROPS***********/

  //will be used to define what content it contains, as is per the sub categories of the
  //settings selection
  export let secondaryFocus;

  //prevent functionalities that may depend on proper auth,
  //hence you don't want to have such work in the event of a logout attempt
  export let pendingLogout;

  //********COMPONENTS********/

  import CredentialsMain from "./main/credentialsMain.svelte";
  import CredentialsCreator from "./creator/credentialsCreator.svelte";

  //********PAGE-FOCUS********/

  import { secondaryFocusEnums } from ".././pageFocusEnums";
</script>

<div class="credentials container">
  {#if secondaryFocus === secondaryFocusEnums.credentials.main}
    <CredentialsMain {pendingLogout} />
  {:else if secondaryFocus === secondaryFocusEnums.credentials.creator}
    <CredentialsCreator {pendingLogout} />
  {/if}
</div>

<style>
</style>
