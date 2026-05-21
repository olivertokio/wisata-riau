// Helper kategori destinasi:
// Simpan kategori tunggal seperti `Budaya`
// atau kategori ganda seperti `Budaya,Sejarah` di field `category`.
// Semua komponen yang perlu membaca kategori ganda sebaiknya memakai helper ini.

export function parseDestinationCategories(categoryValue) {
  if (Array.isArray(categoryValue)) {
    return categoryValue
      .map((item) => String(item).trim())
      .filter(Boolean)
  }

  return String(categoryValue || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function destinationHasCategory(destination, categoryName) {
  return parseDestinationCategories(destination?.category).includes(categoryName)
}

export function destinationSharesCategory(leftDestination, rightDestination) {
  const leftCategories = parseDestinationCategories(leftDestination?.category)
  const rightCategories = parseDestinationCategories(rightDestination?.category)

  return leftCategories.some((category) => rightCategories.includes(category))
}

export function getPrimaryDestinationCategory(destination) {
  return parseDestinationCategories(destination?.category)[0] || ''
}

export function formatDestinationCategories(categoryValue) {
  return parseDestinationCategories(categoryValue).join(', ')
}
