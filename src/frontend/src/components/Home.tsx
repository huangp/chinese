import React, {useGlobal, setGlobal} from "reactn"
import {Phrase} from "./Phrase"
import {ScoreRecorder} from "./ScoreRecorder"
import {Summary} from "./Summary";
import { useParams } from "react-router-dom";
import {getScoresByUserFromLocalStorage, saveScoresToLocalStorage} from "../clientserver/scoreClient";
import {errorHandler} from "../utils";
import {State} from "reactn/default";

export const Home = () => {
    const {username} = useParams()

    const [scores] = useGlobal("scores")
    const [user] = useGlobal('user')
    const [users] = useGlobal('users')
    const currentUser = user ? user.username : undefined
    const selectUser = users.find(u => u.username === username)

    if (currentUser === undefined) {
        // do not have selected user yet
        setGlobal<State>(Promise.resolve({
            user: selectUser
        }))
    } else if (currentUser !== username) {
        const selectUser = users.find(u => u.username === username)

        // we need to switch user
        console.info(`switching user from ${currentUser} to ${selectUser.username}`)
        const promise = saveScoresToLocalStorage(currentUser, scores)
            .then(() => getScoresByUserFromLocalStorage(username))
            .then(scores => ({
                    user: selectUser,
                    scores,
                    selected: []
                })
            ).catch(errorHandler);
        // @ts-ignore
        setGlobal<State>(promise)
    }

    return (
        <div className="container">
            <Phrase />
            <ScoreRecorder />
            <Summary scores={scores}/>
        </div>
    )
}