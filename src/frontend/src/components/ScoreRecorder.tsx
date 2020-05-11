import * as React from "react"
import {Score} from "../app";
import {markScoresAction, nextPhraseAction} from "../action";
import {RecognizeState} from "../action/types";
import {connect} from "react-redux"

interface ScoreRecorderProps {
    phrase: string,
    selected: string[],
    scores: Score[],
    markScores: (state: RecognizeState) => any,
    nextPhrase: () => any
}

const ScoreRecorder = (props: ScoreRecorderProps) => {
    const {markScores, nextPhrase} = props
    const selectedCorrect = e => markScores(RecognizeState.selectedCorrect)
    const allCorrect = e => markScores(RecognizeState.allCorrect)
    const allWrong = e => markScores(RecognizeState.allWrong)

    return (
        <div className="row">
            <div className="col-sm">
                <button type="button" className="btn btn-info btn-block" onClick={selectedCorrect}>Mark selected correct</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-success btn-block" onClick={allCorrect}>All correct</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-danger btn-block" onClick={allWrong}>All wrong</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-secondary btn-block" onClick={nextPhrase}>Next phrase</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    phrase: state.phrase,
    selected: state.selected,
    scores: state.scores
})

const mapDispatchToProps = dispatch => ({
    markScores: (state: RecognizeState) => dispatch(markScoresAction(state)),
    nextPhrase: () => dispatch(nextPhraseAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(ScoreRecorder)


