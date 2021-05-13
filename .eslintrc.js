const rules = {
  "indent": [
    "error",
    2,
    {
      "SwitchCase": 1
    }
  ],
  "linebreak-style": [
    "error",
    "unix"
  ],
  "semi": [
    "error",
    "always"
  ],
  "eol-last": [
    "error",
    "always"
  ],
  "eqeqeq": [
    "error",
    "always"
  ],
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    ...rules,
  },
  overrides: [
    {
      files: ["src/**/*.ts"],
      env: {
        node: true,
        es2020: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 11,
        sourceType: "module",
      },
      plugins: [
        "@typescript-eslint",
      ],
      rules: {
        ...rules,
        "no-unused-vars": 0,
      },
    },
    {
      files: ["tests/**/*.ts"],
      env: {
        browser: false,
        node: true,
        es2020: true,
        jest: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 11,
        sourceType: "module",
      },
      plugins: [
        "@typescript-eslint",
        "jest",
      ],
      rules: {
        ...rules,
        "no-unused-vars": 0,
        "jest/expect-expect": "off",
        "jest/no-commented-out-tests": "off",
      }, 
    }
  ],
};
