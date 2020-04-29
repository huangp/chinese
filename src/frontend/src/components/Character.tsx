import React, {useDispatch, useGlobal} from "reactn"
import {useState} from "react"
import classname from "classnames"
import {State} from "reactn/default"

export interface CharacterProps {
    character: string
    [propName: string]: any;
}

// reducer to change mark
const select = (global: State, dispatch, char: string) => {
    const selected = global.selected
    if (selected.indexOf(char) < 0) {
        selected.push(char)
    }
    console.log('===')
    return {selected}
}

export const Character = (props: CharacterProps) => {
    const {character} = props
    const [selected] = useGlobal('selected')
    const [highlighted, toggleHighlight] = useState(false)
    const updateSelect = useDispatch(select)

    const onClick = e => {
        toggleHighlight(!highlighted)
        if (!highlighted) {
            updateSelect(character)
        }
    }

    const shouldHighlight = selected.indexOf(character) >= 0;
    const className = classname(props.className, "h1", "m-1", "border border-primary text-center", {
        'bg-info': shouldHighlight,
        'bg-light': !shouldHighlight

    })

    return <span className={className} onClick={onClick}>{character}</span>
}