module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
    },
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "@typescript-eslint/ban-ts-comment": "off"
    }
};
