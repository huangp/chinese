import * as React from "react"
import {useState} from "react"
import classnames from "classnames"

export interface ErrorBannerProps {
    error: string | Error | JSX.Element
}
export const ErrorBanner = (props: ErrorBannerProps) => {
    const error = props.error
    const [show, toggleShow] = useState(!!error)
    let msg
    if (error instanceof Error) {
        msg = error.message
    } else {
        msg = error
    }

    const className = classnames("alert alert-danger alert-dismissible fade", {
        show: show
    })

    return (<div className={className} role="alert">
        {msg}
        <button type="button" className="close" aria-label="Close" onClick={e => toggleShow(!show)}>
            <span aria-hidden="true">&times;</span>
        </button>
    </div>)
}