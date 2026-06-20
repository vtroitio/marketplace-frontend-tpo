export const selectUserRoleCode = (state) => state.auth.user?.role?.code || null;

export const selectUserRoleName = (state) => state.auth.user?.role?.name || null;
