import React from "reactn"
import {useState} from "react"
import {addPhrase} from "../clientserver/phraseClient";
import {Link} from "react-router-dom";

enum SaveStatus {
    saving, saved, unsaved, saveFailed
}

interface ContentState {
    status: SaveStatus;
    text: string;
    error?: string;
}

const statusBar = (content: ContentState): JSX.Element => {
    switch (content.status) {
        case SaveStatus.saved:
            return (<div className="alert alert-success" role="alert">
                Saved
            </div>)
        case SaveStatus.saving:
            return (<div className="alert alert-primary" role="alert">
                Saving...
            </div>)
        case SaveStatus.unsaved:
            return <div />
        case SaveStatus.saveFailed:
            return <div className="alert alert-danger" role="alert">{content.error}</div>
    }
}

export const AddPhrase = () => {
    const [content, setContent] = useState<ContentState>({status: SaveStatus.unsaved, text: '', error: ''})
    const onTextInput = e => {
        const text = e.target.value
        setContent({status: SaveStatus.unsaved, text})
    }

    const submitPhrase = async e => {
        setContent({status: SaveStatus.saving, text: ''})

        try {
            await addPhrase(content.text)
            await setContent({status: SaveStatus.saved, text: ''})
        } catch (err) {
            console.error('failed', err)
            setContent({status: SaveStatus.saveFailed, text: content.text, error: err.message})
        }
    }
    const msgBar = statusBar(content)

    return (
        <div className="container">
            {msgBar}
            <div className="form-group">
                <label htmlFor="newPhraseInput">Add new phrase to study</label>
                <input type="text" className="form-control" id="newPhraseInput" placeholder="type new phrase here" value={content.text} onChange={onTextInput}/>
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-primary" onClick={submitPhrase}>Add</button>
                <Link to="/" className="btn btn-secondary ml-2 ">Back</Link>
            </div>
        </div>

    )
}