export const isFavouritedSelector = (state, id) => {
  let clone = { ...state }
  return clone.favourites.favourites.some(favourite => favourite === id)
}
