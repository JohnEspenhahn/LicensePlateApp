module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [ '@babel/preset-env', { "loose": true } ],
      '@babel/preset-typescript',
      'babel-preset-expo',
    ]
  };
};
