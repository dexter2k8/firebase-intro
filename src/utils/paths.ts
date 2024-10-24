export const API = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_UP: "/api/auth/sign-up",
    SIGN_OUT: "/api/auth/sign-out",
    GET_USER: "/api/auth/get-user",
    VERIFY_TOKEN: "/api/auth/verify-token",
  },
  GET_SCRAPE: "/api/analytics/get-scrape",
  FUNDS: {
    GET_FUNDS: "/api/funds/get-funds",
    POST_FUND: "/api/funds/post-fund",
    PATCH_FUND: "/api/funds/patch-fund/",
    DELETE_FUND: "/api/funds/delete-fund/",
  },
  TRANSACTIONS: {
    GET_TRANSACTIONS: "/api/transactions/get-transactions",
    GET_TRANSACTIONS_BY_FUND: "/api/transactions/get-transactions-by-fund/",
    POST_TRANSACTION: "/api/transactions/post-transaction",
    PATCH_TRANSACTION: "/api/transactions/patch-transaction/",
    DELETE_TRANSACTION: "/api/transactions/delete-transaction/",
  },
  INCOMES: {
    GET_INCOMES: "/api/incomes/get-incomes",
    GET_INCOMES_BY_FUND: "/api/incomes/get-incomes-by-fund/",
    POST_MULTIPLE_INCOMES: "/api/incomes/post-multiple-incomes",
    POST_INCOME: "/api/incomes/post-income",
    PATCH_INCOME: "/api/incomes/patch-income/",
    DELETE_INCOME: "/api/incomes/delete-income/",
  },
};
