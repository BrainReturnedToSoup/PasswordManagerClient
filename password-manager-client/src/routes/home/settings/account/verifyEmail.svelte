<script>
</script>

<div class="verify-email container">
  <h3 class="verify-email header">Verify Email</h3>

  <p class="verify-email description"></p>

  <button>Send Verification Code</button>

  <form action="/home/settings/verify-email" method="POST">
    <label for="verify-email-code-input">Verification Code</label>
    <input id="verify-email-code-input" value="verificationCode" />
    <button type="submit">Verify</button>
  </form>
</div>
