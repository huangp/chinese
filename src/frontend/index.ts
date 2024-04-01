import {start} from "./src/components/App"

import "bootstrap/dist/css/bootstrap.css"

import configureStore from "./src/configureStore";
import {getUsers} from "./src/clientserver/userClient";
import {getPhrases} from "./src/clientserver/phraseClient";
import {errorHandler} from "./src/utils";
import {User} from "./src/app";
import {nextPhrase} from "./src/clientserver/phraseService";


const phrasesPromise: Promise<string[]> = getPhrases()
const usersPromise: Promise<User[]> = getUsers()
const allPromises: Promise<[string[], User[]]> = Promise.all([phrasesPromise, usersPromise])

allPromises.then(values => {
    const [phrases, users] = values
    const phrase = nextPhrase(phrases)
    const store = configureStore({phrases, users, phrase})

    start(store)
}).catch(e => {
    const errorState = errorHandler(e)
    const store = configureStore({...errorState})

    start(store)
})

