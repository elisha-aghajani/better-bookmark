export async function createBookmark(parentId: string) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tabs.length) {
    return;
  }

  await chrome.bookmarks.create({
    parentId,
    title: tabs[0].title,
    url: tabs[0].url,
  });
}
