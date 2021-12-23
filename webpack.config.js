const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackLiveReloadPlugin = require("webpack-livereload-plugin");
const path = require("path");

const entrypoints = ["./dashboard/index.tsx", "./graphics/index.tsx"];

const SRC = path.resolve(__dirname, "src");

const NODECG = path.resolve(
  __dirname,
  "nodecg",
  "bundles",
  "royalhackaway-overlay"
);

const configs = [
  {
    entry: path.resolve(SRC, "index.js"),
    plugins: [
      new CopyWebpackPlugin({
        patterns: [path.resolve(SRC, "static")],
      }),
    ],
    output: {
      path: NODECG,
    },
  },
  ...entrypoints.map((entrypoint) => {
    const parsed = path.parse(entrypoint);

    return {
      mode: "development",
      devtool: "source-map",
      context: path.resolve(SRC, parsed.dir),
      entry: "./" + parsed.base,
      module: {
        rules: [
          {
            test: /\.tsx?$/i,
            use: "babel-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.css$/i,
            use: [
              "style-loader",
              "css-loader",
              "postcss-loader"
            ],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader",
              "css-loader",
              "postcss-loader",
              {
                loader: "sass-loader",
                options: {
                  sassOptions: {
                    includePaths: [path.resolve(SRC, parsed.dir, "scss")],
                  },
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg|woff2?)$/i,
            use: [
              {
                loader: "file-loader",
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(SRC, parsed.dir, "index.html"),
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(SRC, parsed.dir, "index.html"),
          filename: "eventsList.html"
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(SRC, parsed.dir, "index.html"),
          filename: "eventPicker.html"
        }),
        new WebpackLiveReloadPlugin({
          port: 0,
          appendScriptTag: true,
        }),
      ],
      output: {
        path: path.resolve(NODECG, parsed.dir),
      },
    };
  }),
];

module.exports = configs;
