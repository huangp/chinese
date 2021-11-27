import * as React from "react"
import {PureComponent} from "react"
import {CharacterScore} from "./CharacterScore";
import {getUserScoresForAllCharacters, getUserScoresForAllFamiliarCharacters} from "../clientserver/scoreClient";
import {Score, User} from "../app";
import {getAllCharacters} from "../clientserver/phraseClient";
import classname from "classnames"
import {State} from "../reducer";
import {connect} from "react-redux"

interface StateShape {
    familiarScores: Score[];
    allCharCount: number;
    allScores: Score[];
    displayType: DisplayType;
}

export interface ScoreBoardProps {
    currentUser: User
}

enum DisplayType {
    onlyFamiliar, onlyCorrect, onlyIncorrect
}


class ScoreBoard extends PureComponent<ScoreBoardProps, StateShape> {
    constructor(props: ScoreBoardProps) {
        super(props)
        this.state = {familiarScores: [], allCharCount: 0, allScores: [], displayType: DisplayType.onlyFamiliar}
    }

    componentDidMount() {
        let currentUser = this.props.currentUser
        if (currentUser) {
            Promise.all([getUserScoresForAllFamiliarCharacters(currentUser.username), getAllCharacters(), getUserScoresForAllCharacters(currentUser.username)])
                .then(values => {
                    const [scores, allCharCount, allScores] = values
                    this.setState({familiarScores: scores, allCharCount, allScores})
                })
        }
    }

    onlyFamiliarCallback = () => {
        this.setState({...this.state, displayType: DisplayType.onlyFamiliar})
    }

    onlyCorrectCallback = () => {
        this.setState({...this.state, displayType: DisplayType.onlyCorrect})
    }

    onlyIncorrectCallback = () => {
        this.setState({...this.state, displayType: DisplayType.onlyIncorrect})
    }

    render() {
        const currentUser = this.props.currentUser
        const {familiarScores, allScores, allCharCount, displayType} = this.state
        const percentNum = allCharCount !== 0 ? Math.round(familiarScores.length / allCharCount * 100) : 0
        const percent = `${percentNum}%`

        const leadingText = currentUser ? `${currentUser.name} knows ${familiarScores.length} out of ${allCharCount}: ${percent}` : 'Need to select a user first!'


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
                        <li className={onlyFamiliarClass} onClick={this.onlyFamiliarCallback}>Familiar Characters {onlyFamiliarBadge}</li>
                        <li className={onlyCorrectClass} onClick={this.onlyCorrectCallback}>Correct Characters {onlyCorrectBadge}</li>
                        <li className={onlyIncorrectClass} onClick={this.onlyIncorrectCallback}>Incorrect Characters {onlyIncorrectBadge}</li>
                    </ul>
                </li>
                {charsSummary}
            </ul>
        )
    }


}

const mapStateToProps = (state: State) => {
    const {currentUsername, users} = state
    return {
        currentUser: users.find(u => u.username === currentUsername)
    }
}

export default connect(mapStateToProps)(ScoreBoard)
