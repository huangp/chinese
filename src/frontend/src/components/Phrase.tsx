import * as React from "react"
import {Character} from "./Character"
import {toggleSelectCharacter} from "../action";
import {connect} from "react-redux"
import {useEffect, useState} from "react";
import {getUserKnownCharacters} from "../clientserver/scoreClient";

interface PhraseProps {
    phrase: string,
    selectedChars: string[],
    toggleCharacterSelection: (char: string) => any,
    currentUsername: string
}

const Phrase = (props: PhraseProps) => {
    const {phrase, selectedChars, toggleCharacterSelection, currentUsername} = props;
    const chars = Array.from(phrase);
    const [knownChars, setKnownChars] = useState([]);
    useEffect(() => {
        if (currentUsername) {
            getUserKnownCharacters(currentUsername, chars)
                .then(knownChars => {
                    setKnownChars(knownChars);
                })
                .catch(e => {
                    console.error("error getting known characters", e);
                });
        }

    }, [chars, currentUsername])
    const characters = chars.map((c, i) =>
        (<Character selectedChars={selectedChars} className="col-sm"
                    character={c} key={i}
                    isKnown={knownChars.indexOf(c) >= 0}
                    onClickCharacter={toggleCharacterSelection}/>))

    return (
        <div className="row">
            {characters}
        </div>
    )
}

const mapStateToProps = state => ({
    phrase: state.phrase,
    selectedChars: state.selected,
    currentUsername: state.currentUsername
})

const mapDispatchToProps = dispatch => ({
    toggleCharacterSelection: (char: string) => dispatch(toggleSelectCharacter(char))
})

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
