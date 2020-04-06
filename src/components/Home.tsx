import React from "reactn"
import {Phrase} from "./Phrase"

const sample = "我是黄小嘟\n我是黄小皮"

const phrases = sample.split(/\n/)

export const Home = () => {
    const randomIndex: number = Math.floor(Math.random() * phrases.length)
    const phrase = phrases[randomIndex]

    return <Phrase phrase={phrase}></Phrase>
}