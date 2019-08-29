/* global fetch:false */
import { TOGGLE_FAVOURITE_TYPE, FETCH_FAVOURITES_TYPE, fetchFavouritesActionCreator, toggleFavouriteActionCreator } from '../actions'
import { getFavouritesApiUrl } from '../selectors'

/**
 * Get the Favourites List
 * @param apiUrl
 * @returns {Promise<any>}
 */
const fetchFavourites = async (apiUrl) => {
  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json'
    }
  })

  const favourites = await response.json()
  if (!response.ok) {
    const error = new Error('Failed to fetch favourites')
    error.status = response.status
    throw error
  }

  return favourites
}

const toggleFavourites = async (apiUrl, method, eventTypeId) => {
  let url = apiUrl
  if (eventTypeId) {
    url += '/' + eventTypeId
  }
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    },
    method: method
  })

  const favourites = await response.json()
  if (!response.ok) {
    const error = new Error('Failed to add favourites')
    error.status = response.status
    throw error
  }

  return favourites
}

/**
 * Toggle the favourites
 * @param store
 * @returns {function(*): Function}
 */
export default store => next => action => {
  const ret = next(action)
  const state = store.getState()
  const apiUrl = getFavouritesApiUrl(state)
  switch (action.type) {
    case FETCH_FAVOURITES_TYPE:
      store.dispatch(fetchFavouritesActionCreator(fetchFavourites(apiUrl)))
      break
    case TOGGLE_FAVOURITE_TYPE:
      store.dispatch(toggleFavouriteActionCreator(toggleFavourites(apiUrl, action.method, action.payload)))
      break
    default:
      return action
  }

  return ret
}
