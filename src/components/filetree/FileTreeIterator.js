import React from 'react'

function FileTreeIterator(props) {
    const {tree} = props;

    const handleFileClick = (evt, fullPath) => {
        console.log('handleFileClick', fullPath, evt);
    }

    const handleFolderClick = (evt, fullPath) => {
        console.log('handleFolderClick', fullPath, evt);
    }

    return (
        <ol>
            {tree.map((item, i) => {
                if (item.type === 'directory') {
                    return (
                        <li key={`${item.name + i}`}>
                            <button
                                type="button"
                                onClick={(evt) => handleFolderClick(evt, item.fullPath)}>
                                {item.name}
                            </button>
                            <FileTreeIterator tree={item.content} />
                        </li>
                    )
                } else {
                    return (
                        <li key={`${item.name + i}`}>
                            <button
                                type="button"
                                onClick={(evt) => handleFileClick(evt, item.fullPath)}>
                                {item.name}
                            </button>
                        </li>
                    )
                }
            })}
        </ol>
    );
}

export default FileTreeIterator