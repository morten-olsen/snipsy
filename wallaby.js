module.exports = function (w) {

  return {
    files: [
      'src/**/*.ts',
      'tests/testfs.ts',
    ],

    tests: [
      'tests/*.spec.ts'
    ],

    preprocessors: {
      '**/*.js': file => require('babel-core').transform(
                                   file.content,
                                   {sourceMap: true, presets: ['latest']})
    },

    testFramework: 'mocha',

    env: {
      type: 'node'
    },

    setup: function () {
      require('babel-polyfill');
    }
  };
};
