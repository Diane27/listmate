module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
              "react-native-stylename-to-style",
              {
                extensions: ["css"]
              }
            ],
            [
              "react-native-platform-specific-extensions",
              {
                extensions: ["css"]
              }
            ]
          ]
    };
};