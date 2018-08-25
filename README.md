# anybuddy-full-stack-capstone

Anybuddy lets you create events and helps you find like minded buddies

## Screenshots

Home Page View | Login Page View
:-------------------------:|:-------------------------:
![Home Page View](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/home-page-view.png)  |  ![Login Page View](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/login-page-view.png)
About Page | Items Page
![About Page](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/about-page.png) | ![Items Page](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/items-page.png)
Create Item  | Places Page
![Create Item](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/create-item.png) | ![Places Page](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/places-page.png)
Areas Page | Categories Page
![Areas Page](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/areas-page.png) | ![Categories Page](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/categories-page.png)

## Use Cases
1. User should be able to create a list of items that they want to track.
2. User should be able to create a 'Place' which can hold multiple items.
3. User should be able to create an 'Area' which holds multiple places.
4. User should be able to move an item between the places and a place between the areas.
5. User should be able to able to search for items,places and areas.
6. User should be able to delete the items,places and areas.

### UI Flow
![UI Flow handwritten draft](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/User-flow-WhereIsIt_1.jpg)

### Wireframe _main
![Wireframe _Main](https://github.com/nitishbagul/where-is-it-node-capstone/blob/master/github-images/wireframes.jpg)

## Working Prototype
You can find a Node.js working prototype of the app here: https://anybuddy-full-stack-capstone.herokuapp.com/ and React prototype here:

## Functionality
The app's functionality includes:
* Every User has the ability to create an account that stores information unique to them
* User can Add, delete and update - Items, Places, Areas and Categories
* User can search items and places

## Technology
* Front-End: HTML5 | CSS3 | JavaScript ES6 | jQuery
* Back-End: Node.js | Express.js | Mocha | Chai | RESTful API Endpoints | MongoDB | Mongoose



## Responsive
App is strongly built to be usuable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Reminders and email notifications about the status of the items
* Supporting multiple categories for single item

#  The typical command lines for capstone projects

## Node command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cors express mongodb mongoose passport passport-http unirest
    * npm install --save-dev chai chai-http mocha faker
* nodemon server.js ==> run node server
* npm test ==> run the tests

## React command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cheerio chokidar-cli concurrently core-js cors cpr enzyme enzyme-react-16-adapter-setup express http-server jsonwebtoken moment mongodb mongoose morgan npm-run-all passport passport-http passport-jwt passport-jwt-strategy react react-addons-test-utils react-dom react-fontawesome react-redux redux redux-thunk rimraf unirest
    * npm install --save-dev acorn babel-cli babel-core babel-loader babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-es2015 babel-preset-react chai chai-enzyme chai-http enzyme-adapter-react-15 enzyme-adapter-react-16 faker json-loader mkdirp mocha react-scripts react-test-renderer sinon sinon-chai webpack
* npm run build ==> build the react files in the "build" folder
* npm start ==> run react server on http://127.0.0.1:8080
* npm test ==> run the tests






