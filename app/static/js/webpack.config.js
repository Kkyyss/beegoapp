var webpack = require('webpack');
var ETP = require("extract-text-webpack-plugin");

module.exports = {
   entry: [
     "./app/app.js",
     "./app/AppRoutes.js",     
     "./app/Components/Master.js",
     "./app/Components/Footer.js",     
     "./app/Components/Home/HomePage.js",
     "./app/Components/LoginRegister/LoginRegisterPage.js",
     './app/Components/User/UserDropDownMenu.js',
     './app/Components/User/UserPage.js',
     './app/Components/User/UserAccountPage.js',
     './app/Components/User/UserRequestConsolePage.js',
     './app/Components/User/UserBookedRoomPage.js',
     './app/Components/User/RoomStatusPage.js',
     './app/Components/User/UserNotificationConsolePage.js',
     './app/Components/User/UserDownloadsPage.js',
     './app/Components/User/AddRequestComponents/AddRequestDialog.js',
     './app/Components/Admin/RoomConsolePage.js',
     './app/Components/Admin/RequestConsolePage.js',
     './app/Components/Admin/BookedRoomConsolePage.js',
     './app/Components/Admin/UserConsolePage.js',
     './app/Components/Admin/AdminConsolePage.js',
     './app/Components/Admin/RoomTypeConsolePage.js',
     './app/Components/Admin/NotificationConsolePage.js',
     './app/Components/Admin/RoomComponents/AddRoomDialog.js',
     './app/Components/Admin/UserComponents/AddUserDialog.js',
     './app/Components/Admin/AdminComponents/AddAdminDialog.js',
     './app/Components/Admin/RoomTypeComponents/AddRoomTypeDialog.js',
     './app/Components/Admin/NotificationComponents/AddNotificationDialog.js',
     './app/Components/Error/FourZeroOnePage.js',
     './app/Components/Error/FourZeroFourPage.js',
     './app/Components/Error/FiveZeroZeroPage.js',
     './app/Components/INTI/IUPage.js',
     './app/Components/INTI/IICSPage.js',
     './app/Components/INTI/IICKLPage.js',
     './app/Components/INTI/IICPPage.js',
   ],
    output: {
        path: __dirname,
        filename: "./build/bundle.js"
    },
  module: {
      loaders: [
      { test: /\.css$/,
        loader:ETP.extract("style-loader","css-loader")
      },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: "url-loader?limit=100000" },
      {
            test: /\.jsx?$/,
            loader: 'babel',
            query:
            {
                presets:['es2015', 'react', 'stage-0']
            }
      }],
      resolve: {
          extensions: ['', '.js', '.jsx', '.css'],
          modulesDirectories: [
            'node_modules'
          ]
      }
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ETP("./build/bundle.css"),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  ]
};
