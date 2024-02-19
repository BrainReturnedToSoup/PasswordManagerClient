import authApis from "../requestAPIs/auth";
import { pendingAuthCheckStore, authStateStore } from "../state/auth/auth";

//this promise resolves as a simple boolean, true meaning the user is properly authed, and false if not
const checkAuth = async () => {
  pendingAuthCheckStore.pendingTrue();

  const result = await authApis.get.check();

  result.success && result.auth
    ? authStateStore.authedTrue()
    : authStateStore.authedFalse();

  pendingAuthCheckStore.pendingFalse();
};

export default checkAuth;
