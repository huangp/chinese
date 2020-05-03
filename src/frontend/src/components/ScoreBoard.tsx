import React from "reactn"
import {PureComponent} from "react"
import {CharacterScore} from "./CharacterScore";
import {getUserScoresForAllFamiliarCharacters} from "../clientserver/scoreClient";
import {Score} from "../app";

interface StateShape {
    scores: Score[]
}

export interface ScoreBoardProps {
    username: string
}


export class ScoreBoard extends PureComponent<ScoreBoardProps, StateShape> {
    constructor(props: ScoreBoardProps) {
        super(props)
        this.state = {scores: []}
    }

    componentDidMount() {
        let username = this.props.username
        if (username) {
            getUserScoresForAllFamiliarCharacters(username)
                .then(scores => this.setState({scores}))
        }
    }

    render() {
        const charsSummary = this.state.scores.map((s, i) => <li className="list-group-item" key={i}><CharacterScore score={s} /></li>)
        return (
            <ul className="list-group list-group-flush">
                {charsSummary}
            </ul>
        )
    }


}
