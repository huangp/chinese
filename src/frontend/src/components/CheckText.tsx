import * as React from "react"
import {useState} from "react"
import {Link} from "react-router-dom";
import {State} from "../reducer";
import {connect} from "react-redux";
import {checkText} from "../clientserver/textClient";
import {bulkAddPhrases} from "../clientserver/phraseClient";

enum SaveStatus {
    saving, saved, unsaved, saveFailed
}

interface ContentState {
    status: SaveStatus;
    text: string;
    error?: string;
}

const statsBar = (content: ContentState): JSX.Element => {
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
interface CheckTextProps {
    currentUsername: string;
}
const CheckText = ({currentUsername}: CheckTextProps) => {
    const [content, setContent] = useState<ContentState>({status: SaveStatus.unsaved, text: '', error: ''});
    const [annotatedContent, setAnnotatedContent] = useState(null);
    const [stats, setStats] = useState<string | null>(null);

    const onTextInput = e => {
        const text = e.target.value
        setContent({status: SaveStatus.unsaved, text})
    }

    const submitPhrases = async e => {
        setContent({status: SaveStatus.saving, text: ''})

        try {
            await bulkAddPhrases(content.text)
            setContent({status: SaveStatus.saved, text: ''})
        } catch (err) {
            console.error('failed', err)
            setContent({status: SaveStatus.saveFailed, text: content.text, error: err.message})
        }
    }

    const submitCheckText = async e => {
        setContent(prevState => ({status: SaveStatus.saving, text: prevState.text}))

        try {
            const checkTextResponse = await checkText(currentUsername, content.text);
            console.info("check text result", checkTextResponse)
            const {phrases, known, total, unknownCount} = checkTextResponse;
            const annotated = phrases
                .filter(phrase => phrase.trim().length > 0)
                .map(phrase => <div dangerouslySetInnerHTML={{__html: Array.from(phrase)
                        .reduce((previousValue, currentValue) => {
                            if (known.indexOf(currentValue) < 0) {
                                return `${previousValue}${currentValue}`;
                            } else {
                                return `${previousValue}<span class="text-success">${currentValue}</span>`;
                            }
                        })}}></div>);
            setAnnotatedContent(annotated);
            setStats(`total ${total}, unknown ${unknownCount}`);

            setContent(prevState => ({status: SaveStatus.saved, text: prevState.text}))
        } catch (err) {
            console.error('failed', err)
            setContent({status: SaveStatus.saveFailed, text: content.text, error: err.message})
        }
    }
    const msgBar = statsBar(content)

    return (
        <div className="container">
            {msgBar}
            <div className="form-group">
                <label htmlFor="checkTextInput">Check text against known characters</label>
                <textarea className="form-control" id="checkTextInput" placeholder="enter text here"
                          value={content.text} onChange={onTextInput}
                          rows={20}
                />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-primary" onClick={submitCheckText}>Check</button>
                <button type="submit" className="btn btn-primary" onClick={submitPhrases}>Add Phrase(s)</button>
                <Link to="/" className="btn btn-secondary ml-2 ">Back</Link>
            </div>
            <div>
                {stats && <div className="alert alert-success">{stats}</div>}
                {annotatedContent && annotatedContent.map((html, index) => <div key={index}>{html}</div>)}
            </div>
        </div>

    )
}

const mapStateToProps = (state: State) => {
    return {
        currentUsername: state.currentUsername
    }
}

export default connect(mapStateToProps)(CheckText)