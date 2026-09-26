function exportAsPrint() {
  window.print();
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    return true;
  } catch {
    // Fallback for browsers without Clipboard API permission
    const input = document.createElement('input');
    input.value = location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
  }
}
