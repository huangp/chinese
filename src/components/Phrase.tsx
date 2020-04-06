import React from "reactn"
import {Character} from "./Character"

export interface PhraseProps {
    phrase: string
}

export const Phrase = (props: PhraseProps) => {
    const chars = Array.from(props.phrase)
    const phrase = chars.map((c, i) => (<Character className="col-xs border border-primary" character={c} key={i} />));

    return (
        <div className="container">
            <div className="row">
                {phrase}
            </div>
        </div>
    )

}
