const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const dev = process.env.NODE_ENV !== 'production';
const dev = false;


const config = {
  entry: './index.js',

  output: {
    filename: 'index.js',
    path: __dirname + '/public',
    /* IMPORTANT! FOR StaticSiteGeneratorPlugin
     * You must compile to UMD or CommonJS
     * so it can be required in a Node context: */
    // libraryTarget: 'umd',
    // globalObject: 'this',
    // publicPath: '',
  },
  devServer: {
    compress: true,
    port: 9000,
    watchFiles: {
      paths: ['./src/*', './src/**/*', './src/**/**/']
    }
 },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { 
            loader: 'babel-loader'
          },
          {
            loader: '@linaria/webpack-loader',
            options: {
              sourceMap: dev,
            },
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { sourceMap: dev },
          },
        ],
      },
    ]
  },

  plugins: [
    // new StaticSiteGeneratorPlugin({
    //   paths: [
    //       '../dist/sheet.html'
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: './styles.css',
    }),
    new MiniCssExtractPlugin({
      filename: '../dist/styles.css',
    })
  ]
}


module.exports = (env, argv) => {
  //Configure config based on mode

  if (argv.mode === 'production') {
    //Using staticsitegeneratorplugin with webpack-dev-server throws an annoying "self is not defined error"... 
    //so lets just run it on production only
    config.output.libraryTarget = 'umd';
    config.output.globalObject = 'this',
    config.plugins.push(
      new StaticSiteGeneratorPlugin({
        paths: [
        '../dist/sheet.html'
        ]
      })
    );
  }

  return config;
}
  

  