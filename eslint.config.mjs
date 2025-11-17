import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ...eslintPluginPrettierRecommended,
  rules: {
    ...eslintPluginPrettierRecommended.rules,
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    // Désactiver les warnings sur les props optionnelles (shadcn-vue pattern)
    'vue/require-default-prop': 'off',
    'vue/no-required-prop-with-default': 'off',
    // Désactiver les erreurs any pour les libs tierces (auto-form, etc.)
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/unified-signatures': 'warn',
  },
  // Désactiver la vérification TypeScript pour éviter les boucles infinies
  settings: {
    'nuxt/typescript': {
      typeCheck: false,
    },
  },
})
