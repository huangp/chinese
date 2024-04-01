import * as React from "react"
import {useState} from "react"
import {Link, NavLink} from "react-router-dom"
import classnames from "classnames"
import {Loading} from "./Loading";
import {AwardFillIcon, ChatIcon} from "./Icon";
import {connect} from "react-redux"
import {User} from "../app";
import {State} from "../reducer";
import {getNewPhrasesAction} from "../action";

interface NavBarProps {
    users: User[],
    username: string,
    loading: boolean,
    loadNewPhrases: () => any
}

const NavBar = (props: NavBarProps) => {
    const {username, users, loading, loadNewPhrases} = props

    const [showCollapse, toggleShowCollapse] = useState(false)

    const currentUsername = username

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
                <button className={actionBtnClass} onClick={loadNewPhrases} >Get new phrases</button>
                <Link className="btn btn-outline-success m-2 my-sm-0 float-right" to="/phrase/add">Add new phrase</Link>
                <Link className="btn btn-outline-success m-2 my-sm-0 float-right" to="/text/check">Check text</Link>
            </div>
        </nav>
    )

}

const mapStateToProps = (state: State) => ({
    loading: state.loading,
    username: state.currentUsername,
    users: state.users
})

const mapDispatchToProps = dispatch => ({
    loadNewPhrases: () => dispatch(getNewPhrasesAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)