import React, {useGlobal, setGlobal} from "reactn"
import {useState} from "react"
import {Link, NavLink} from "react-router-dom"
import classnames from "classnames"
import {Loading} from "./Loading";
import {AwardFillIcon, ChatIcon} from "./Icon";
import {getNextPhrases} from "../clientserver/phraseClient";
import {nextPhrase} from "../clientserver/phraseService";

export const NavBar = () => {
    const [users] = useGlobal('users')
    const [user] = useGlobal('user')
    const [loading] = useGlobal('loading')

    const [showCollapse, toggleShowCollapse] = useState(false)

    const currentUsername = user ? user.username : undefined

    const getNextNewPhrases = async () => {
        await setGlobal({loading: true})
        try {
            const phrases = await getNextPhrases()
            setGlobal({
                loading: false,
                selected: [],
                scores: [],
                phrases,
                phrase: nextPhrase(phrases, 0)
            })
        } catch (e) {
            setGlobal({
                loading: false,
                error: e
            })
        }
    }

    const navDivClassname = classnames('collapse navbar-collapse', {
        show: showCollapse
    })

    const togglerClassname = classnames('navbar-toggler', {
        collapsed: !showCollapse
    })

    const userNav = users.map(u => {
            const className = `nav-item ${u.username === currentUsername ? 'active' : ''}`

            return (
                <li className={className} key={u.username}>
                    <Link className="nav-link" to={`/${u.username}`}>{u.name}</Link>
                </li>
            )
        }
    )

    const actionBtnClass = classnames("btn btn-outline-success m-2 my-sm-0", {
        visible: !loading,
        invisible: loading
    })

    const loadingClass = classnames({
        visible: loading,
        invisible: !loading
    })

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand text-primary" >
                <AwardFillIcon />
            </Link>
            <button className={togglerClassname} type="button" onClick={e => toggleShowCollapse(!showCollapse)}
                    aria-controls="navbarNav" aria-expanded={showCollapse} aria-label="Switch User">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={navDivClassname}>
                <ul className="navbar-nav mr-auto">
                    {userNav}
                </ul>
                <Loading className={loadingClass} />
                <button className={actionBtnClass} onClick={getNextNewPhrases} >Get new phrases</button>
                <Link className="btn btn-outline-success m-2 my-sm-0 float-right" to="/phrase/add">Add new phrase</Link>
            </div>
        </nav>
    )

}