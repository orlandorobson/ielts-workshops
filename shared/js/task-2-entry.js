// All teaching now lives in the continuous workshop.
const url = new URL(location.href);
if (url.searchParams.has('historical')) url.hash='saved-work';
url.searchParams.delete('historical');
url.searchParams.delete('lesson');
history.replaceState(null,'',url);
await import('./task-2-continuous.js?v=quality-check-3');
