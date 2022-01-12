import React, {useEffect} from 'react'

function FileTree(props) {
    const { fs } = props;

    useEffect(async () => {
        const dir = await fs.promises.readdir('/');
        console.log('dir', dir);
    }, []);

    return (
        <div>FileTree</div>
    );
}

export default FileTree