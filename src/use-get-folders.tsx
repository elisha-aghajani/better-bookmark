import { useEffect, useState } from 'react';

export function useGetFolders() {
  const [folders, setFolders] = useState<chrome.bookmarks.BookmarkTreeNode[]>(
    [],
  );

  useEffect(() => {
    async function getFolders() {
      const tree = await chrome.bookmarks.getTree();
      const root = tree[0];

      calculatePathsForFolders(root);
      const folders = filterFolders(root).sort(
        (a, b) => b.dateGroupModified! - a.dateGroupModified!,
      );

      setFolders(folders);
    }

    getFolders();
  }, []);

  return folders;
}

function calculatePathsForFolders(
  root: chrome.bookmarks.BookmarkTreeNode,
  currentPath = '',
): void {
  currentPath = currentPath ? currentPath + '/' + root.title : root.title;

  if (root.children) {
    root.children.forEach((child) =>
      calculatePathsForFolders(child, currentPath),
    );

    root.path = currentPath;
  }
}

function filterFolders(
  root: chrome.bookmarks.BookmarkTreeNode,
  folders?: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] {
  folders = folders || [];

  if (root.children) {
    if (root.id !== '0') {
      folders.push(root);
    }

    for (const child of root.children) {
      filterFolders(child, folders);
    }
  }

  return folders;
}
