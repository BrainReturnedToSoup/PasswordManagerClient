async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error(
      `copyToClipboard catch block: value: ${value} error: ${error} ${error.stack}`
    );
  }
}

export default copyToClipboard;
