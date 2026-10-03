(() => {
  const key = 'davidruck-theme';
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }
})();
