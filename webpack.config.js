const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const srcDir = 'src';
const distDir = 'dist';
const wwwDir = 'www';
const filesJs = /\.js$/;
const filesCss = /\.css$/;
const filesLess = /\.less$/;

module.exports = {
    stats: {
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        moduleTrace: true,
        errorDetails: true,
        children: false,
        chunks: false,
        assets: true
    },
    entry: {
        'demo-geo': path.resolve(srcDir, 'bootstrap.tsx')
    },
    output: {
        path: path.resolve(distDir, wwwDir),
        filename: '[name]-[hash].js',
        publicPath: ''
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new CleanWebpackPlugin([
            // clear dist/www
            distDir
        ], {
            verbose: true,
            root: path.resolve()
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(srcDir, 'index.html'),
            inject: true,
            minify: false,
            cache: true,
            showErrors: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-[hash].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['ts-loader']
            },
            {
                test: filesJs,
                include: path.resolve(srcDir),
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: filesCss,
                use: [
                    {
                        // to place css in css files
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            plugins: [
                                autoprefixer()
                            ]
                        }
                    }
                ]
            },
            {
                test: filesLess,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         sourceMap: false
                    //     }
                    // },
                    'less-loader'
                ]
            },
            {
                // fonts dependencies
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                            publicPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                // inject images as url
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'images/',
                            publicPath: 'images/'
                        }
                    }
                ]
            }
        ]
    }
};
