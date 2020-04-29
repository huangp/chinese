import React, {useGlobal} from "reactn"
import {Character} from "./Character"

export const Phrase = () => {
    const [phrase] = useGlobal('phrase')
    const chars = Array.from(phrase)
    const characters = chars.map((c, i) => (<Character className="col-sm" character={c} key={i}/>));

    return (
        <div className="row">
            {characters}
        </div>
    )

}
