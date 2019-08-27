import { ActionType } from 'redux-promise-middleware'
import { FETCH_EVENTS_TYPE } from '../actions'

const initialState = {
  busy: false,
  events: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case `${FETCH_EVENTS_TYPE}_${ActionType.Pending}`:
      return {
        ...state,
        busy: true
      }
    case `${FETCH_EVENTS_TYPE}_${ActionType.Fulfilled}`:
      return {
        ...state,
        busy: false,
        error: undefined,
        events: action.payload
      }
    case `${FETCH_EVENTS_TYPE}_${ActionType.Rejected}`:
      return {
        ...state,
        busy: false,
        error: true,
        events: action
      }
    default:
      return state
  }
}

export default reducer
