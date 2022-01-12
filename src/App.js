import './App.css';
import React, {useState, useRef} from 'react'
import Editor from "./editor/Editor";
import LightningFS from '@isomorphic-git/lightning-fs';
import FileTree from "./filetree/FileTree";

function App() {
    const [html, setHtml] = useState();
    const [markdown, setMarkdown] = useState();
    const [isSaving, setIsSaving] = useState(false);
    const fsRef = useRef(new LightningFS('markee'));

    const handleSaveClick = async () => {
        const fs = fsRef.current;
        setIsSaving(true);

        await fs.promises.writeFile('/index.md', markdown,{ encoding: 'utf8' });
        const fileContent = await fs.promises.readFile('/index.md',{ encoding: 'utf8' });
        setIsSaving(false);
        console.log('fileContent', fileContent);
    };

    const handleEditorChange = ({markdown, html}) => {
        setMarkdown(markdown);
        setHtml(html);
    };

    return (
        <main>
            <FileTree fs={fsRef.current} />
            <Editor onEditorChange={handleEditorChange} />
            <button type="button" disabled={isSaving} onClick={handleSaveClick}>Save</button>
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </main>
    )
}

export default App;
