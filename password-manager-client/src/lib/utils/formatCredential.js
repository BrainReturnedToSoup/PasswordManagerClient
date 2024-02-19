function formatCredential(result) {
  return {
    name: result.credential_name,
    emailUsername: result.email_username,
    password: result.pw,
    description: result.description,
  };
}

export default formatCredential;
