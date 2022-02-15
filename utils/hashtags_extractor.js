export const findHashtags = (searchText) => {
  if (!searchText) return null
  const regexp = /\B\#\w\w+\b/g
  const result = searchText.match(regexp);
  if (result) {
    return result
  } else {
    return []
  }
}