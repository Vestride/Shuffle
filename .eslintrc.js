module.exports = {
  extends: ['airbnb', 'eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['react'],
  env: {
    browser: true,
  },
  rules: {
    // We like _private methods and variables. It's easier to refactor code
    // when you know other components shouldn't be using private methods + props.
    'no-underscore-dangle': 'off',

    // Allow + and - in the same line.
    'no-mixed-operators': 'off',

    // Shadowing is a nice language feature. Naming is hard.
    'no-shadow': 'off',

    // Make inheritance annoying sometimes.
    'class-methods-use-this': 'off',

    // Allow `i++` in loops.
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // Allow reassigning properties of objects.
    'no-param-reassign': ['error', { props: false }],

    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'warn',
  },
};
