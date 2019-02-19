import { combineReducers } from 'redux';
import { INITDATA, INFOUPDATE, SHOWLOADING, HOMEDATA, FOLLOW, AUTHENTICATION, NICKNAME } from './types.js';
const defaultState = {
    userData: {},
    isLoading: false,
    homedata: null,
}
function reducer(state = defaultState, action) {
    switch (action.type) {
        case INITDATA:
            return {
                ...state,
                userData: action.data
            }
        case INFOUPDATE:
            return {
                ...state,
                userData: Object.assign({}, state.userData, action.data)
            }
        case SHOWLOADING:
            return {
                ...state,
                isLoading: action.status
            }
        case HOMEDATA:
            return {
                ...state,
                homedata: action.data
            }
        case FOLLOW:
            return {
                ...state,
                userData: Object.assign({}, state.userData, { is_attention_public: action.status })
            }
        case AUTHENTICATION:
            return {
                ...state,
                userData: Object.assign({}, state.userData, { is_authentication: action.status })
            }
        case NICKNAME:
            return {
                ...state,
                userData: Object.assign({}, state.userData, { nick_name: action.status })
            }
        default:
            return state
    }
}
export default combineReducers({ reducer })