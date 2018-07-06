const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        homepage: './src/homepage/homepage.js',
        map: './src/map/map.js',
        statistic: './src/statistic/statistic.js',
        admin: './src/admin/admin.js',
        mapDetails: './src/map/map-details/map-details.js',
        articles: './src/articles/articles.js'
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0
        }
    },
    devtool: 'source-map',
    devServer: {
        port: process.env.PORT || 3000,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.handlebars$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\/js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourcemap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            autoprefixer: {
                                browsers: ['last 2 browser']
                            },
                            sourcemap: true,
                            plugins: () => [
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourcemap: true
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/',
                            useRelativePath: true
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: true
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            svgo: {
                                enabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /font-awesome\.config\.js/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'font-awesome-loader' }
                ]
            },
            {
                test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery'
            },
            {
                test: require.resolve("dataTables.net"), loader: "imports?define=>false,$=jquery"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {}),
        new ExtractTextPlugin(
            './homepage/homepage.scss'
        ),
        new ExtractTextPlugin(
            './map/map.scss'
        ),
        new ExtractTextPlugin(
            './map/map-details/map-details.scss'
        ),
        new ExtractTextPlugin(
            './statistic/statistic.scss'
        ),
        new ExtractTextPlugin(
            './admin/admin.scss'
        ),
        new ExtractTextPlugin(
            './articles/articles.scss'
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Tether: "tether",
            "window.Tether": "tether",
            Popper: ['popper.js', 'default'],
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Util: "exports-loader?Util!bootstrap/js/dist/util",
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {}
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Home',
            template: './src/homepage/homepage.handlebars'
        }),
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Map',
            template: './src/map/map.handlebars',
            filename: 'map.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Statistic',
            template: './src/statistic/statistic.handlebars',
            filename: 'statistic.html',
        }),
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Admin',
            template: './src/admin/admin.handlebars',
            filename: 'admin.html',
        }),
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Map Details',
            template: './src/map/map-details/map-details.handlebars',
            filename: 'map-details.html',
        }),  
        new HtmlWebpackPlugin({
            title: 'Patriot Pangan - Articles',
            template: './src/articles/articles.handlebars',
            filename: 'articles.html',
        }),  
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['homepage/**/*.handlebars'],
            assets: ['homepage/homepage.css'],
            append: true
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['map/**/*.handlebars'],
            assets: ['map/map.css'],
            append: true
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['statistic/**/*.handlebars'],
            assets: ['statistic/statistic.css'],
            append: true
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['articles/**/*.handlebars'],
            assets: ['articles/articles.css'],
            append: true
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['map/map-details/*.handlebars'],
            assets: ['map/map-details/map-details.css'],
            append: true
        }),
    ]
}