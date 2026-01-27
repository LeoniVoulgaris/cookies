const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "main.js", // keep it simple
  },
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    },
    {
      test: /\.css$/i,   // 👈 this handles CSS files
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource'
    }
  ],
},
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
  mode: "development", // 👈 add this to silence the warning
};
