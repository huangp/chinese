import * as React from "react"
import {Provider, connect} from "react-redux"

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import * as ReactDOM from "react-dom"
import Home from "./Home"
import NavBar from "./NavBar";
import {AddPhrase} from "./AddPhrase";
import ScoreBoard from "./ScoreBoard";
import Banner from "./Banner"
import {User} from "../app";
import CheckText from "./CheckText";

interface AppProps {
    users: User[],
    phrases: string[],
    error?: string | Error,
    loading: boolean
}

const App = (props: AppProps) => {

    return (
        <Router>
            <div className="mt-5">
                <NavBar/>
                <Banner/>
                <Switch>
                    <Route path="/phrase/add">
                        <AddPhrase/>
                    </Route>
                    <Route path="/text/check">
                        <CheckText />
                    </Route>
                    <Route path="/scoreboard">
                        <ScoreBoard />
                    </Route>
                    <Route path="/:username">
                        <Home/>
                    </Route>
                    <Route path="/">
                        <div>Select a learner</div>
                    </Route>
                    <Route path="*">
                        <Redirect to="/"/>
                    </Route>
                </Switch>
            </div>

        </Router>
    )
}

const mapStateToProps = (state) => ({
    users: state.users,
    phrases: state.phrases,
    error: state.error,
    loading: state.loading
})

// const mapDispatchToProps = (dispatch) => {
//     return {
//         loadRecentPhrases: dispatch(requestRecentPhrases()),
//         loadUsers: dispatch(requestUsers())
//     }
// }

const ConnectedApp = connect(mapStateToProps)(App)

export const start = (store) => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedApp/>
        </Provider>,
        document.getElementById('root')
    )
}