
import pluginJs from "@eslint/js"
import eslintConfigPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintReact from 'eslint-plugin-react'
import eslintReactHooks from 'eslint-plugin-react-hooks'
import eslintReactRefresh from 'eslint-plugin-react-refresh'
import globals from "globals"


export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    plugins: {
      'react': eslintReact,
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
    }
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }, ecmaVersion: "latest",
        sourceType: "module"
      }
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  },
  {
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      'prefer-const': 'error',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'max-lines': ['warn', { max: 124 }],
    }
  }

]