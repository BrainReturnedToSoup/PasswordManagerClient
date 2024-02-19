import { authStateStore } from "../state/auth/auth";
import { redirectToLoginStore } from "../state/auth/redirect";
import { errorMessageStore } from "../state/home/error";

//*************UTITLIES*************/

//will display an error message
function expiredSessionRedirect() {
  const fourSecondDelay = 4000;

  setTimeout(() => {
    redirectToLoginStore.true();
    authStateStore.authedFalse();
    errorMessageStore.clear();
  }, fourSecondDelay); // a delayed redirect to the login page, alerting the user of their auth status first.

  errorMessageStore.set("Session expired, please log-in and try again");
}

export default expiredSessionRedirect;
