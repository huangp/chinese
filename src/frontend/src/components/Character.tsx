import * as React from "react"
import classname from "classnames"

export interface CharacterProps {
    selectedChars: string[],
    character: string,
    onClickCharacter: (char: string) => void,
    [propName: string]: any;
}



export const Character = (props: CharacterProps) => {
    const {character, selectedChars, onClickCharacter} = props

    const alreadySelected = selectedChars.indexOf(character) >= 0;

    const onClick = e => onClickCharacter(character)

    const className = classname(props.className, "h1", "m-1 p-1", "border border-primary text-center", {
        'bg-info': alreadySelected,
        'bg-light': !alreadySelected

    })

    return <span className={className} onClick={onClick}>{character}</span>
}