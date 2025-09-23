// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Ignora diretórios que não devem ser analisados
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.strapi/',
      '.tmp/',
      'data/',
      'scripts/',
    ],
  },

  // Configurações recomendadas do ESLint
  pluginJs.configs.recommended,

  // Configuração do Prettier (desativa regras do ESLint que conflitam com o Prettier)
  prettierConfig,

  // Configuração principal para arquivos JavaScript e JSX
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Regras recomendadas do plugin do React
      ...pluginReact.configs.recommended.rules,

      // Regras do React Hooks (adicionadas manualmente, como é o correto)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Ativa a regra do Prettier para mostrar erros de formatação
      'prettier/prettier': 'error',

      // Nossas regras customizadas e sobrescritas
      'react/react-in-jsx-scope': 'off', // Não é necessário com o novo JSX transform
      'react/prop-types': 'warn', // Avisa sobre a falta de prop-types, mas não quebra o build
      'no-unused-vars': 'warn', // Avisa sobre variáveis não utilizadas
    },
    settings: {
      react: {
        version: 'detect', // Detecta a versão do React automaticamente
      },
    },
  },
];
