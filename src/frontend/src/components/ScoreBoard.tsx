import React from "reactn"
import {PureComponent} from "react"
import {CharacterScore} from "./CharacterScore";
import {getUserScoresForAllCharacters, getUserScoresForAllFamiliarCharacters} from "../clientserver/scoreClient";
import {Score} from "../app";
import {getAllCharacters} from "../clientserver/phraseClient";
import {User} from "../clientserver/userClient";
import classname from "classnames"

interface StateShape {
    familiarScores: Score[];
    allCharacters: string[];
    allScores: Score[];
    displayType: DisplayType;
}

export interface ScoreBoardProps {
    user?: User
}

enum DisplayType {
    onlyFamiliar, onlyCorrect, onlyIncorrect
}


export class ScoreBoard extends PureComponent<ScoreBoardProps, StateShape> {
    constructor(props: ScoreBoardProps) {
        super(props)
        this.state = {familiarScores: [], allCharacters: [], allScores: [], displayType: DisplayType.onlyFamiliar}
    }

    componentDidMount() {
        let user = this.props.user
        if (user) {
            Promise.all([getUserScoresForAllFamiliarCharacters(user.username), getAllCharacters(), getUserScoresForAllCharacters(user.username)])
                .then(values => {
                    const [scores, allCharacters, allScores] = values
                    this.setState({familiarScores: scores, allCharacters, allScores})
                })
        }
    }

    render() {
        const user = this.props.user
        const {familiarScores, allScores, allCharacters, displayType} = this.state
        const allCharCount = allCharacters.length
        const percentNum = allCharCount !== 0 ? Math.round(familiarScores.length / allCharCount * 100) : 0
        const percent = `${percentNum}%`

        const leadingText = user ? `${user.name} knows ${familiarScores.length} out of ${allCharCount}: ${percent}` : 'Need to select a user first!'


        let charsSummary = undefined
        let onlyFamiliarBadge = undefined
        let onlyCorrectBadge = undefined
        let onlyIncorrectBadge = undefined
        const scoreToDisplay = (s, i) => <li className="list-group-item" key={i}><CharacterScore score={s} /></li>
        switch (displayType) {
            case DisplayType.onlyFamiliar:
                charsSummary = familiarScores.map(scoreToDisplay)
                onlyFamiliarBadge = <span className="m-1 badge badge-pill badge-success">{charsSummary.length}</span>
                break;
            case DisplayType.onlyCorrect:
                charsSummary = allScores.filter(s => s.correct > s.incorrect).map(scoreToDisplay)
                onlyCorrectBadge = <span className="m-1 badge badge-pill badge-success">{charsSummary.length}</span>
                break;
            case DisplayType.onlyIncorrect:
                charsSummary = allScores.filter(s => s.incorrect > s.correct).map(scoreToDisplay)
                onlyIncorrectBadge = <span className="m-1 badge badge-pill badge-danger">{charsSummary.length}</span>
                break;
        }

        const onlyFamiliarClass = classname("list-group-item list-group-item-action", {
            active: displayType == DisplayType.onlyFamiliar
        })
        const onlyCorrectClass = classname("list-group-item list-group-item-action", {
            active: displayType == DisplayType.onlyCorrect
        })
        const onlyIncorrectClass = classname("list-group-item list-group-item-action", {
            active: displayType == DisplayType.onlyIncorrect
        })

        const onlyFamiliarCallback = e => this.setState({...this.state, displayType: DisplayType.onlyFamiliar})
        const onlyCorrectCallback = e => this.setState({...this.state, displayType: DisplayType.onlyCorrect})
        const onlyIncorrectCallback = e => this.setState({...this.state, displayType: DisplayType.onlyIncorrect})



        return (
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div>{leadingText}</div>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: percent}} aria-valuenow={percentNum}
                             aria-valuemin={0} aria-valuemax={allCharCount}>{percent}
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <ul className="list-group list-group-horizontal">
                        <li className={onlyFamiliarClass} onClick={onlyFamiliarCallback}>Familiar Characters {onlyFamiliarBadge}</li>
                        <li className={onlyCorrectClass} onClick={onlyCorrectCallback}>Correct Characters {onlyCorrectBadge}</li>
                        <li className={onlyIncorrectClass} onClick={onlyIncorrectCallback}>Incorrect Characters {onlyIncorrectBadge}</li>
                    </ul>
                </li>
                {charsSummary}
            </ul>
        )
    }


}
