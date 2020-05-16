const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin=require('mini-css-extract-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, 'src', 'index.js')
  ],
  output: {
    path: path.join(__dirname, 'build'),

    filename: 'index.bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'src'),
    hot: true,
    proxy: {
      '/api': { // 代理接口前缀为/api的请求
        target: 'http://localhost:3000',  //转接到本地3000端口(后端服务器监听的端口)
        changeOrigin: true, // 是否允许跨域
        pathRewrite: {
          '^/api': '' // 重写路径,则转发请求时不会协带前缀api
        },
        // secure: false
      },
    }

  },
  module: {
    rules: [

      { // ES6、JSX处理
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {

          plugins: [
            [
              'import',
              { libraryName: 'antd', style: 'css' }
            ] // antd按需加载
          ]
        },
      },

      { // CSS处理
        test: /\.(css|less)$/,
        // loader: "style-loader!css-loader?modules",
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',

            options: {
              // 设置css modules
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },

            }
          },
          {
            loader: 'less-loader', // 将 Less 编译为 CSS
            // options: {
            //         modifyVars: {
            //           'primary-color': '#1DA57A',
            //           'link-color': '#1DA57A',
            //           'border-radius-base': '2px'
            //         },
            //         javascriptEnabled: true,
            //      },
          },


          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     publicPath: '../',
          //     hmr: process.env.NODE_ENV === 'development',
          //   },
          // },
        ],
        // loader: "style-loader!css-loader?modules=true&localIdentName=[local]___[hash:base64:5]",
        exclude: /node_modules/,
      },

      { // antd样式处理
        test: /\.css$/,
        exclude: /src/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'less-loader', // 将 Less 编译为 CSS
            // options: {
            //         modifyVars: {
            //           'primary-color': '#1DA57A',
            //           'link-color': '#1DA57A',
            //           'border-radius-base': '2px'
            //         },
            //         javascriptEnabled: true,
            //      },
          }
        ]
      },

      { // 图片处理
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024, // 小于该值的图片会使用base64编码
          name: 'imgs/[name].[hash:8].[ext]' // 打包后的图片名称 [ext]指图片格式
        }
      },
    ]
  },

  // 引入百度变量
  // externals:{
  //   'BMapGL':'BMapGL'
  // },

  //   module: {
  //     rules: [
  //       {
  //         //ES6、JSX处理
  //         test: /\.(js|jsx)$/,
  //         // 不希望编译node_modules中的任何内容
  //         exclude: /node_modules/,
  //         use: ['babel-loader']
  //       },

  //       {   // 对于node_modules文件夹以外的less文件, 开启css module模式
  //         test: /\.(css|less)$/,
  //         exclude: /node_modules/,
  //         use: [
  //             {
  //                 loader: 'style-loader'
  //             },
  //             {
  //                 loader: 'css-loader',
  //                 options: {
  //                     // 开启css modules
  //                     modules: true,
  //                     localIdentName: '[local]___[hash:base64:6]',
  //                     importLoaders:1
  //                 }
  //             },
  //             {
  //                 loader: 'postcss-loader'
  //             },
  //             {
  //                 loader: 'less-loader'// 将 Less 编译为 CSS
  //             }
  //         ]
  //       },

  //       {   // 对于node_modules文件夹以外的less文件, 不开启css module模式
  //         test: /\.(css|less)$/,
  //         include: /node_modules/,
  //         use: [
  //             {
  //                 loader: 'style-loader'
  //             },
  //             {
  //                 loader: 'css-loader',
  //                 options: {
  //                     importLoaders:1
  //                 }
  //             },
  //             {
  //                 loader: 'postcss-loader'
  //             },
  //             {
  //                 loader: 'less-loader'// 将 Less 编译为 CSS
  //             }
  //         ]
  //       }


  //     //   {
  //     //     test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
  //     //     loaders: ['file-loader']
  //     //   }
  //     ]
  //   }

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      // favicon: path.join(__dirname, 'favicon.ico'), // 在此处设置
    }),

    // new MiniCssExtractPlugin(
    //   {
    //   filename: process.env.NODE_ENV === 'production' ? 'static/index.[contenthash:7].css' : 'static/index.css'
    // }
    // )
  ]
};