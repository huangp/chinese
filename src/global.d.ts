import {Score} from "./app";

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

    }

    export interface State {
        scores: Score[];
        user: string;
    }
}