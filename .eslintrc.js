module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  globals: {
    ga: "readonly", // Google Analytics
    __statics: "readonly",
    process: "readonly",
    chrome: "readonly",
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    parser: require.resolve("@typescript-eslint/parser"),
  },
  root: true,
  rules: {
    "prefer-promise-reject-errors": "off",
    quotes: ["warn", "single", { avoidEscape: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-unused-vars": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
