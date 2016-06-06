# todoapp
Simple todo app using [Express](http://expressjs.com), [Sequelize](http://docs.sequelizejs.com/en/latest/)/Postgre and [Passport](http://passportjs.org) with [Google OAuth](https://github.com/jaredhanson/passport-google-oauth2) and [JWT](https://github.com/themikenicholson/passport-jwt) ([JSON Web Tokens](http://jwt.io)). Tested with *Node.js 6.2.0*.

##Usage
* Run `npm install` to install the dependencies listed on *package.json*;
* Insert your **clientID** and **clientSecret** (create your credentials [here](https://console.developers.google.com/apis/credentials)) in *server.js* and set-up your database connection in *config/config.json*;
* Start the app with `node server.js`. The default port is `80`.
