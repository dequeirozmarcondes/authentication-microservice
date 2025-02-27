import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["node_modules", "dist"], // Ignorar diretórios desnecessários
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
