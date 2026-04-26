# Integration/E2E Critical Flows Plan

## Backend integration flows

1. Auth: register -> login -> authorized endpoint
2. Cart: add item -> update quantity -> remove item
3. Checkout: create order -> stock decrement validation
4. Admin: change stock -> change order status -> user role update

## Frontend E2E flows

1. User signup/login flow
2. Catalog filters/search/pagination
3. Cart + checkout happy path
4. Orders history and order detail
5. Admin actions on products/orders/users

## Exit criteria

- Every critical flow has at least one passing automated test.
- Failure scenarios covered (invalid auth, out-of-stock, unauthorized admin access).
- Tests are integrated into CI with clear pass/fail reporting.
