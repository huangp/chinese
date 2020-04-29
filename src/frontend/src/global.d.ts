import {Score} from "./app";
import {User} from "./clientserver/userClient"

declare module 'reactn/default' {




    export interface Reducers {

        useUser: (
            global: State,
            dispatch: Dispatch,
            user: string
        ) => Pick<State, 'user'>;

        updateScore: (
            global: State,
            dispatch: Dispatch,
            score: Score,
        ) => Pick<State, 'scores'>;

        setPhrase: (
            global: State,
            dispatch: Dispatch,
            phrase: string
        ) => Pick<State, 'phrase'>;

        markSelected: (
            global: State,
            dispatch: Dispatch,
            selected: string[]
        ) => Pick<State, 'selected'>;

        markAll: (
            global: State,
            dispatch: Dispatch,
            correct: boolean
        ) => Pick<State, 'scores'>;

        nextPhrase: (
            global: State,
            dispatch: Dispatch
        ) => Pick<State, 'scores' & 'selected'>;
    }

    export interface State {
        loading?: boolean;
        phrases: string[]
        scores: Score[];
        users: User[];
        user: User;
        // the selected characters in current phrase
        selected: string[];
        // current phrase to study
        phrase: string;
        // any error
        error?: string
    }
}