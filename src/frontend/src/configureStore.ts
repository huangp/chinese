import {applyMiddleware, compose, createStore, StoreEnhancer} from "redux"
import {thunk} from "redux-thunk"
import logger from "redux-logger"
import {initialState, rootReducer} from "./reducer";
import saveUserScoresMiddleware from "./middleware/saveUserScoresMiddleware"

export default function configureStore(preloadedState) {
    const middlewares = [saveUserScoresMiddleware, thunk, logger]
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const enhancers = [middlewareEnhancer]
    const composedEnhancers: StoreEnhancer = compose(...enhancers)

    const startState = {...initialState, ...preloadedState}
    const store = createStore(rootReducer, startState, composedEnhancers)

    return store
}