import { useRef } from 'react';
import Select, { createFilter, type SelectInstance } from 'react-select';
import { useGetFolders } from './use-get-folders';
import { createBookmark } from './create-bookmark';
import './popup.css';

function IndexPopup() {
  const folders = useGetFolders();

  const selectRef =
    useRef<SelectInstance<chrome.bookmarks.BookmarkTreeNode> | null>(null);

  return (
    <div className="popup">
      <h1>Add Bookmark</h1>

      <Select
        ref={selectRef}
        autoFocus
        menuIsOpen
        placeholder={<div>Select folder...</div>}
        options={folders}
        getOptionValue={(folder) => folder.id}
        getOptionLabel={(folder) => folder.title}
        formatOptionLabel={(folder, metadata) => {
          if (metadata.context === 'value') {
            return <div className="option-label">{folder.title}</div>;
          } else if (metadata.context === 'menu') {
            return (
              <div className="option-label">
                <strong>{folder.title}</strong>
                <br />
                {folder.path}
              </div>
            );
          }
        }}
        onInputChange={(inputValue, metadata) => {
          if (metadata.action === 'input-change') {
            const folderFilter =
              createFilter<chrome.bookmarks.BookmarkTreeNode>();

            const firstMatchedFolder = folders.find((folder) =>
              folderFilter(
                { data: folder, label: folder.title, value: folder.id },
                inputValue,
              ),
            );

            if (firstMatchedFolder && selectRef.current) {
              selectRef.current.setState({ focusedOption: firstMatchedFolder });
            }
          }
        }}
        onChange={(folder, metadata) => {
          if (metadata.action === 'select-option' && folder) {
            createBookmark(folder.id).then(() => window.close());
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            window.close();
          }
        }}
        components={{
          DropdownIndicator: null,
          IndicatorSeparator: null,
        }}
      />
    </div>
  );
}

export default IndexPopup;
