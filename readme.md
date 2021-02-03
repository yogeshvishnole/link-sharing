Nodejs server setup steps --

commands
npm init -y
npm install nodemon --save-dev
npm install @babel/core @babel/node --save-dev
npm install @babel/preset-env --save-dev
touch .babelrc

# .babelrc content
{
    "presets":["@babel/preset-env"]
}

Make environment config file
command
touch .env
npm install dotenv
npm install express
npm install cors
