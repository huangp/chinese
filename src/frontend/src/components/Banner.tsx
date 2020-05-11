import * as React from "react"
import { connect } from "react-redux"
import {ErrorBanner} from "./ErrorBanner";
import ScoreBadge from "./ScoreBadge";
import {Loading} from "./Loading";
import {User} from "../app";
import {State} from "../reducer";

interface BannerProps {
    currentUsername: string | undefined,
    users: User[],
    phrases: string[],
    message: string | undefined | null,
    loading: boolean
}

const Banner = (props: BannerProps) => {
    const {users, currentUsername, phrases, message, loading} = props
    if (users.length === 0) {
        return <ErrorBanner error="Please add user first" />
    } else if (message) {
        return <ErrorBanner error={message} />
    } else if (phrases.length === 0) {
        return <ErrorBanner error="Please add phrase first" />
    } else if (currentUsername) {
        const user = users.find(u => u.username === currentUsername)
        return (<div className="alert alert-info" role="alert">
            {user?.name}
            <ScoreBadge/>
        </div>)
    } else if (loading) {
        return <Loading/>
    }
    return null
}

const mapStateToProps = (state: State) => ({
    users: state.users,
    phrases: state.phrases,
    message: state.message,
    currentUsername: state.currentUsername,
    loading: state.loading
})

export default connect(mapStateToProps)(Banner)
