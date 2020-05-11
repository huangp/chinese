import * as React from "react"
import {Character} from "./Character"
import {toggleSelectCharacter} from "../action";
import {connect} from "react-redux"

interface PhraseProps {
    phrase: string,
    selectedChars: string[],
    toggleCharacterSelection: (char: string) => any
}

const Phrase = (props: PhraseProps) => {
    const {phrase, selectedChars, toggleCharacterSelection} = props
    const chars = Array.from(phrase)
    const characters = chars.map((c, i) =>
        (<Character selectedChars={selectedChars} className="col-sm" character={c} key={i} onClickCharacter={toggleCharacterSelection}/>))

    return (
        <div className="row">
            {characters}
        </div>
    )
}

const mapStateToProps = state => ({
    phrase: state.phrase,
    selectedChars: state.selected
})

const mapDispatchToProps = dispatch => ({
    toggleCharacterSelection: (char: string) => dispatch(toggleSelectCharacter(char))
})

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
