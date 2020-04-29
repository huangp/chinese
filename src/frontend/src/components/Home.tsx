import React, {useGlobal, setGlobal} from "reactn"
import {Phrase} from "./Phrase"
import {ScoreRecorder} from "./ScoreRecorder"
import {Summary} from "./Summary";

export const Home = () => {
    const [scores] = useGlobal("scores")

    return (
        <div className="container">
            <Phrase />
            <ScoreRecorder />
            <Summary scores={scores}/>
        </div>
    )
}