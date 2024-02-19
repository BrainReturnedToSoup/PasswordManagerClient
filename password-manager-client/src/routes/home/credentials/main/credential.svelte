<script>
  //*************PROPS***************/

  export let id, name;

  //**************DESC***************/

  import { errorMessageStore } from "../../../../lib/state/home/error";
  import credApis from "../../../../lib/requestAPIs/credentials";
  import expiredSessionRedirect from "../../../../lib/utils/expiredSessionRedirect";

  let description = "",
    descriptionPending = false;

  async function handleDesc() {
    if (description) {
      description = "";
      return; //for toggling the description display closed
    }

    const result = await credApis.get.description(id);

    if (!result.success) {
      "auth" in result && !result.auth
        ? expiredSessionRedirect()
        : errorMessageStore(result.error);
    } else {
      description = result.description;
    }

    descriptionPending = false;
  }

  //***************UPDATE***************/

  //will be responsible for switching to the update focus that already contains the corresponding
  //credential's information within the fields. The updater uses the same structure as the creator.

  //need to fetch the entire credential set, so that each property can be applied to corresponding fields
  //that can be changed.

  import { updaterStateStore } from "../../../../lib/state/home/updater";
  import { secondaryFocusStore } from "../../../../lib/state/home/focus";
  import formatCredential from "../../../../lib/utils/formatCredential";

  let pendingUpdateRedirect = false;

  async function updateRedirect() {
    pendingUpdateRedirect = true;

    const result = await credApis.get.credentials(id);

    if (!result.success) {
      "auth" in result && !result.auth
        ? expiredSessionRedirect()
        : errorMessageStore(result.error);
    } else {
      const formatted = formatCredential(result.credential);

      updaterStateStore.set({
        ...formatted,
        credentialID: id,
      }); //add the corresponding credential field values to the updater

      secondaryFocusStore.credentials.updater(); //change the focus to the updater so the user can update the corresponding credentials
    }

    pendingUpdateRedirect = false;
  }

  //***************DELETE***************/

  import { credSetStore } from "../../../../lib/state/home/credSet";

  let pendingDelete = false;

  async function handleDelete() {
    pendingDelete = true;

    const result = await credApis.delete.credential(id);

    if (!result.success) {
      "auth" in result && !result.auth
        ? expiredSessionRedirect()
        : errorMessageStore(result.error);
    } else {
      credSetStore.update((currState) => {
        delete currState[id];
        return currState;
      }); //update the credential state to reflect a specific credential being deleted, causes rerender
    }

    pendingDelete = false;
  }

  //**********COPY-EMAIL-USERNAME*******/

  import copyToClipboard from "../../../../lib/utils/copyToClipboard";

  let pendingEmailUsername = false;

  async function copyEmailUsername() {
    if (!navigator.clipboard) {
      const error = `copy emailUsername error: no navigator clipboard`;
      console.error(error);
      errorMessageStore.set(error);
      return;
    }

    pendingEmailUsername = true;

    const result = await credApis.get.emailUsername(id);

    if (!result.success) {
      "auth" in result && !result.auth
        ? expiredSessionRedirect()
        : errorMessageStore(result.error);
    } else {
      await copyToClipboard(result.emailUsername);
    }

    pendingEmailUsername = false;
  }

  //***********COPY-PASSWORD************/

  let pendingPassword = false;

  async function copyPassword() {
    if (!navigator.clipboard) {
      const error = `copy password error: no navigator clipboard`;
      console.error(error);
      errorMessageStore.set(error);
      return;
    }

    pendingPassword = true;

    const result = await credApis.get.password(id);

    if (!result.success) {
      "auth" in result && !result.auth
        ? expiredSessionRedirect()
        : errorMessageStore(result.error);
    } else {
      await copyToClipboard(result.password);
    }

    pendingPassword = false;
  }
</script>

<div class="credential">
  <h2 class="credential name">{name}</h2>

  <div class="credential buttons update delete">
    <button class="credential button update" on:click={updateRedirect}
      >Update</button
    >
    <button class="credential button delete" on:click={handleDelete}
      >Delete</button
    >
  </div>

  <div class="credential buttons copy">
    <button
      class="credential button copy email-username"
      on:click={copyEmailUsername}
    >
      Copy Email/Username
    </button>
    <button class="credential button copy password" on:click={copyPassword}>
      Copy Password
    </button>
  </div>

  <div class="credential description container">
    <button class="credential description toggle" on:click={handleDesc}
      >Description</button
    >
    {#if description}
      <p class="credential description">
        {description}
      </p>
    {/if}
  </div>
</div>
