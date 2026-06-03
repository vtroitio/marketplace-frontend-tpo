/**
 * Formatea un número como precio en dólares.
 * @param {number} price
 * @returns {string} ej: "$45.00"
 */
export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

/**
 * Calcula el promedio de rating de un array de reseñas.
 * @param {Array} reviews - Array con objetos que tienen la propiedad `rating`
 * @returns {number}
 */
export function getRatingAverage(reviews) {
  if (!reviews?.length) return 0;
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
}
