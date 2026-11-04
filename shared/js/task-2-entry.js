// Keep historical links and saved workshop records intact.
const url = new URL(location.href);
if (url.searchParams.has('historical')) url.hash='saved-work';
url.searchParams.delete('historical');
url.searchParams.delete('lesson');
history.replaceState(null,'',url);
const startPages = ['', '#explore', '#layout', '#learning-unit'];
if (startPages.includes(url.hash)) {
  await import('./task-2-explorer.js?v=recognition-1');
} else {
  const pages = document.createElement('nav');
  pages.className = 'task2-page-links';
  pages.setAttribute('aria-label','Workshop pages');
  pages.innerHTML = '<a href="#explore">1 · Question types</a><a href="#layout">2 · Essay layout</a>';
  document.querySelector('.journey-nav').before(pages);
  await import('./task-2-continuous.js?v=quality-check-3');
}
// Switching between the new pages and the existing workshop needs a fresh renderer.
window.addEventListener('hashchange', () => {
  if (location.hash === '#learning-unit') return;
  if (startPages.includes(location.hash) || startPages.includes(url.hash)) location.reload();
});
