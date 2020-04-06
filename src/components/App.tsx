import React, {setGlobal, useGlobal} from "reactn"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import * as ReactDOM from "react-dom"
import {Home} from "./Home"

// Set an initial global state directly:
setGlobal({
    scores: [],
    user: 'Amelia',
})

const App = () => {
    const [user, useUser] = useGlobal('user')

    return (
        <Router>
            <div className="mt-5">
                <div className="alert alert-info" role="alert">{user}</div>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>

        </Router>
    )
}

export const start = () => ReactDOM.render(
    <App />, document.getElementById("root")
)