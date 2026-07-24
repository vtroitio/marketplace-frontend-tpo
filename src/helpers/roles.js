export const ROLES = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

const ROLE_LEVELS = {
  BUYER: 1,
  SELLER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Checks if the user has the required role or a higher role.
 * @param {string} requiredRole 
 * @param {string} userRole 
 */
export function hasRole(requiredRole, userRole) {
  if (!userRole) {
    return false;
  }

  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}
