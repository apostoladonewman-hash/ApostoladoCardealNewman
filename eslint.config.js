import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. Configurações Globais
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.strapi/',
      '.tmp/',
      'public/uploads/',
      'frontend/dist/',
      '**/*.d.ts',
    ],
  },

  // 2. Configuração Padrão do Prettier (desativa regras conflitantes)
  prettierConfig,

  // ================================================================\
  // 3. CONFIGURAÇÃO PARA O BACKEND (Strapi - Arquivos .js em CommonJS)\
  // ================================================================\
  {
    files: [
      'config/**/*.js',
      'src/**/*.js',
      'database/**/*.js',
      'scripts/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },

  // ================================================================\
  // 4. CONFIGURAÇÃO PARA O FRONTEND (React + TypeScript)\
  // ================================================================\
  {
    files: ['frontend/src/**/*.{ts,tsx}'], // Apenas para o código-fonte da aplicação
    plugins: {
      '@typescript-eslint': tseslint,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './frontend/tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // ================================================================\
  // 5. NOVA CONFIGURAÇÃO: Arquivos TS de configuração do Frontend (Vite)\
  // ================================================================\
  {
    files: ['frontend/vite.config.ts'], // Alvo específico
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './frontend/tsconfig.node.json', // Usa o tsconfig correto para o ambiente Node
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];