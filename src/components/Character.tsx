import React from "reactn"
import {useState} from "react"
import classname from "classnames"

export interface CharacterProps {
    character: string
    [propName: string]: any;
}

enum RecognizeState {
    correct, incorrect, reset
}

export const Character = (props: CharacterProps) => {
    const [recognizeState, toggleRecognizeState] = useState(RecognizeState.reset)
    const onClick = e => {
        const state: RecognizeState = recognizeState
        if (state == RecognizeState.reset) {
            toggleRecognizeState(RecognizeState.correct)
        } else if (state == RecognizeState.correct) {
            toggleRecognizeState(RecognizeState.incorrect)
        } else {
            toggleRecognizeState(RecognizeState.reset)
        }
    }

    const className = classname(props.className, "h1", "p-1 m-1", {
        'bg-success': recognizeState == RecognizeState.correct,
        'bg-danger': recognizeState == RecognizeState.incorrect,
        'bg-light': recognizeState == RecognizeState.reset

    })

    return <span className={className} onClick={onClick}>{props.character}</span>
}