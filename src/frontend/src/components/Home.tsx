import * as React from "react"
import Phrase from "./Phrase"
import ScoreRecorder from "./ScoreRecorder"
import {Summary} from "./Summary";
import { useParams } from "react-router-dom";
import {Loading} from "./Loading";
import {connect} from "react-redux"
import {Score, User} from "../app";
import {switchUserAction} from "../action";
import {State} from "../reducer";
import {saveScoresToLocalStorage} from "../clientserver/scoreClient";

interface HomeProps {
    scores: Score[],
    currentUsername: string,
    users: User[],
    switchUser: (string) => void
}

const Home = (props: HomeProps) => {
    const {username} = useParams()
    const {scores, currentUsername, users, switchUser} = props


    if (currentUsername === undefined && users.length == 0) {
        // the app is not ready yet
        return <Loading/>
    }

    if (currentUsername !== username) {
        const selectUser = users.find(u => u.username === username)

        // we need to switch user
        console.info(`switching user from ${currentUsername} to ${selectUser.username}`)

        if (selectUser) {
            saveScoresToLocalStorage(currentUsername, scores)
                .then(() => switchUser(selectUser))
        }
    }

    return (
        <div className="container">
            <Phrase/>
            <Summary scores={scores}/>
            <ScoreRecorder />
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        scores: state.scores,
        users: state.users,
        currentUsername: state.currentUsername
    }
}

const mapDispatchToProps = dispatch => ({
    switchUser: user => dispatch(switchUserAction(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)