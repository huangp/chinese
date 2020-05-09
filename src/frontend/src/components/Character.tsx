import React, {useGlobal, setGlobal} from "reactn"
import {useState} from "react"
import classname from "classnames"

export interface CharacterProps {
    character: string
    [propName: string]: any;
}

// reducer to change mark
const updateSelect = (selected: string[], char: string, select: boolean): string[] => {
    const index = selected.indexOf(char)
    if (select) {
        if (index < 0) {
            selected.push(char)
        }
    } else {
        if (index >= 0) {
            selected.splice(index, 1)
        }
    }
    return selected
}

export const Character = (props: CharacterProps) => {
    const {character} = props
    const [selected] = useGlobal('selected')
    const [highlighted, toggleHighlight] = useState(false)

    const onClick = async e => {
        toggleHighlight(!highlighted)
        const updatedSelected = updateSelect(selected, character, highlighted);
        await setGlobal({selected: updatedSelected})
    }

    const shouldHighlight = selected.indexOf(character) >= 0;
    const className = classname(props.className, "h1", "m-1 p-1", "border border-primary text-center", {
        'bg-info': shouldHighlight,
        'bg-light': !shouldHighlight

    })

    return <span className={className} onClick={onClick}>{character}</span>
}