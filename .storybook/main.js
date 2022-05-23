module.exports = {
  stories: ["../stories"],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: "ts-loader"
        },
        {
          loader: "react-docgen-typescript-loader"
        }
      ]
    });

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  }
};
