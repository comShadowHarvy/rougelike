const js = require("@eslint/js");
module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                "process": "readonly",
                "console": "readonly",
                "module": "readonly",
                "require": "readonly",
                "__dirname": "readonly",
                "jest": "readonly",
                "describe": "readonly",
                "it": "readonly",
                "expect": "readonly",
                "beforeEach": "readonly",
                "setTimeout": "readonly"
            }
        },
        rules: {
            "semi": ["warn", "always"],
            "quotes": ["warn", "single"],
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
        }
    }
];
