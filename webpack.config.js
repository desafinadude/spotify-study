const path = require('path');

module.exports = {
  entry: {
    main: './spotify-study.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
