import React, { useContext } from 'react'
import {GlobalContext} from "../../../context/global.context";

function FileTreeControls(props) {
    const globalContext = useContext(GlobalContext);

    return (
        <div>
            <button
                type="button"
                disabled={globalContext.isSaving}
                onClick={globalContext.onSave}>
                Save
            </button>
        </div>
    );
}

export default FileTreeControls