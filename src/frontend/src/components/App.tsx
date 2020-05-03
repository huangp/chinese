import React, {setGlobal, useGlobal} from "reactn"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import * as ReactDOM from "react-dom"
import {Home} from "./Home"
import {nextPhrase} from "../clientserver/phraseService"
import {getUsers, User} from "../clientserver/userClient";
import {NavBar} from "./NavBar";
import {errorHandler} from "../utils";
import {ScoreBadge} from "./ScoreBadge";
import {getPhrases} from "../clientserver/phraseClient";
import {AddPhrase} from "./AddPhrase";
import {ErrorBanner} from "./ErrorBanner";
import {Loading} from "./Loading";
import {ScoreBoard} from "./ScoreBoard";

// Set an initial global state directly:
setGlobal({
    loading: true,
    phrases: [],
    users: [],
    user: undefined,
    scores: [],
    selected: [],
    phrase: ''
})

class App extends React.PureComponent {
    componentDidMount() {
        const phrasesPromise: Promise<string[]> = getPhrases()
        const usersPromise: Promise<User[]> = getUsers()
        const allPromises: Promise<[string[], User[]]> = Promise.all<string[], User[]>([phrasesPromise, usersPromise])
        this.setGlobal(allPromises.then(
            values => {
                const [phrases, users] = values
                return {
                    loading: false,
                    phrases,
                    users,
                    phrase: nextPhrase(phrases)
                }
            }
            // TODO if error is 401, need to redirect user to login
        ).catch(errorHandler))
    }

    render() {
        const users = this.global.users
        const user = this.global.user
        const phrases = this.global.phrases
        const error = this.global.error
        const loading = this.global.loading

        let banner: JSX.Element
        if (users.length === 0) {
            banner = <ErrorBanner error="Please add user first" />
        } else if (error) {
            banner = <ErrorBanner error={error} />
        } else if (phrases.length === 0) {
            banner = <ErrorBanner error="Please add phrase first" />
        } else if (user) {
            banner = (<div className="alert alert-info" role="alert">
                {user?.name}
                <ScoreBadge/>
            </div>)
        } else if (loading) {
            banner = <Loading/>
        }

        console.debug("current global state", this.global)

        return (
            <Router>
                <div className="mt-5">
                    <NavBar />
                    {banner}
                    <Switch>
                        <Route path="/phrase/add">
                            <AddPhrase/>
                        </Route>
                        <Route path="/scoreboard">
                            <ScoreBoard user={user} />
                        </Route>
                        <Route path="/:username">
                            <Home/>
                        </Route>
                        <Route path="/">
                            <div>Select a learner</div>
                        </Route>
                        <Route path="*">
                            <Redirect to={`/`}/>
                        </Route>
                    </Switch>
                </div>

            </Router>
        )
    }


}

export const start = () => ReactDOM.render(
    <App/>, document.getElementById("root")
)