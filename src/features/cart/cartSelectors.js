export const selectTotalArticles = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
