import React, {useGlobal, setGlobal} from "reactn"
import {useState} from "react"
import {Link, NavLink} from "react-router-dom"
import {errorHandler} from "../utils";
import classnames from "classnames"
import {User} from "../clientserver/userClient"
import {
    clearUserScoresInLocalStorage,
    getScoresByUserFromLocalStorage,
    saveScoresToLocalStorage,
    saveUserScore
} from "../clientserver/scoreClient";
import {State} from "reactn/default"
import {Loading} from "./Loading";

export const NavBar = () => {
    const [users] = useGlobal('users')
    const [user] = useGlobal('user')
    const [scores] = useGlobal('scores')
    const [phrases] = useGlobal('phrases')
    const [loading] = useGlobal('loading')

    const [showCollapse, toggleShowCollapse] = useState(false)

    const switchUser = (userToSwitchTo: User) => {
        const currentUser = user.username
        setGlobal<State>(saveScoresToLocalStorage(currentUser, scores)
            .then(() => getScoresByUserFromLocalStorage(userToSwitchTo.username))
            .then(scores => ({
                    user: userToSwitchTo,
                    scores,
                    selected: []
                })
            ).catch(errorHandler)
        )
    }

    const saveScores = () => {
        setGlobal({loading: true})
        users.forEach(async u => {
            const scoresToSave = u.username === user.username ? scores : getScoresByUserFromLocalStorage(u.username)
            try {
                await saveUserScore(u.username, scoresToSave, phrases)
                await clearUserScoresInLocalStorage(u.username)
                setGlobal({
                    loading: false,
                    selected: [],
                    scores: []
                })
            } catch (e) {
                setGlobal({
                    loading: false,
                    error: e
                })
            }
        })
    }

    const navDivClassname = classnames('collapse navbar-collapse', {
        show: showCollapse
    })

    const togglerClassname = classnames('navbar-toggler', {
        collapsed: !showCollapse
    })

    const userNav = users.map(u => {
            const className = `nav-item ${u.username === user.username ? 'active' : ''}`

            return (
                <li className={className} key={u.username}>
                    <a className="nav-link" href="#" onClick={e => u !== user ? switchUser(u) : false}>{u.name}</a>
                </li>
            )
        }
    )

    const saveScoreBtnClass = classnames("btn btn-outline-success m-2 my-sm-0", {
        visible: !loading,
        invisible: loading
    })

    const loadingClass = classnames({
        visible: loading,
        invisible: !loading
    })

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand" href="">中文</Link>
            <button className={togglerClassname} type="button" onClick={e => toggleShowCollapse(!showCollapse)}
                    aria-controls="navbarNav" aria-expanded={showCollapse} aria-label="Switch User">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={navDivClassname}>
                <ul className="navbar-nav mr-auto">
                    {userNav}
                </ul>
                <Loading className={loadingClass} />
                <button className={saveScoreBtnClass} onClick={saveScores} >Save scores</button>
                <Link className="btn btn-outline-success m-2 my-sm-0 float-right" to="/phrase/add">Add new phrase</Link>
            </div>
        </nav>
    )

}