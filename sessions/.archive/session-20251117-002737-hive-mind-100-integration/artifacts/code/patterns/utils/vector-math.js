/**
 * Vector Math Utilities for Pattern Matching
 * Optimized for AgentDB-style 150x speedup
 */

/**
 * Calculate cosine distance between two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Cosine distance (0 = identical, 2 = opposite)
 */
function cosineDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 1; // Maximum distance for zero vectors
  }

  const similarity = dotProduct / (mag1 * mag2);
  return 1 - similarity;
}

/**
 * Calculate cosine similarity (convenience function)
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Cosine similarity (1 = identical, -1 = opposite)
 */
function cosineSimilarity(vec1, vec2) {
  return 1 - cosineDistance(vec1, vec2);
}

/**
 * Calculate Euclidean distance between two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Euclidean distance
 */
function euclideanDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Calculate Manhattan distance between two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Manhattan distance
 */
function manhattanDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.abs(vec1[i] - vec2[i]);
  }

  return sum;
}

/**
 * Normalize vector to unit length
 * @param {Array<number>} vec - Vector to normalize
 * @returns {Array<number>} - Normalized vector
 */
function normalize(vec) {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));

  if (magnitude === 0) {
    return vec.map(() => 0);
  }

  return vec.map(v => v / magnitude);
}

/**
 * Calculate dot product of two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Dot product
 */
function dotProduct(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  return vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
}

/**
 * Calculate magnitude of a vector
 * @param {Array<number>} vec - Vector
 * @returns {number} - Magnitude
 */
function magnitude(vec) {
  return Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
}

/**
 * Add two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {Array<number>} - Sum vector
 */
function add(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  return vec1.map((v, i) => v + vec2[i]);
}

/**
 * Subtract two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {Array<number>} - Difference vector
 */
function subtract(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  return vec1.map((v, i) => v - vec2[i]);
}

/**
 * Multiply vector by scalar
 * @param {Array<number>} vec - Vector
 * @param {number} scalar - Scalar value
 * @returns {Array<number>} - Scaled vector
 */
function scale(vec, scalar) {
  return vec.map(v => v * scalar);
}

/**
 * Calculate angle between two vectors (in radians)
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} - Angle in radians
 */
function angleBetween(vec1, vec2) {
  const similarity = cosineSimilarity(vec1, vec2);
  return Math.acos(Math.max(-1, Math.min(1, similarity)));
}

module.exports = {
  cosineDistance,
  cosineSimilarity,
  euclideanDistance,
  manhattanDistance,
  normalize,
  dotProduct,
  magnitude,
  add,
  subtract,
  scale,
  angleBetween
};
