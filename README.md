# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Steps to run:

1. Clone the repository.
2. Install dependencies using **npm install**
3. Copy **sample.env** file into new **.env** file and provide values
4. In case the application is intended to run in production mode:
   a. build the React FE using: **npm run build**
   b. run project using: **npm start**
5. In case the application is intended to run in development mode:
   a. run Express development server using: **npm run start-watch**
   b. run React development server using: **npm run serve**

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the express server in production mode
Open [http://localhost:7500](http://localhost:7500) to view it in your browser.

### `npm run start-dev`

Runs the express server in production mode with --inspect flag
Open [http://localhost:7500](http://localhost:7500) to view it in your browser.

### `npm run start-watch`

Runs the express server in development mode
Open [http://localhost:7500](http://localhost:7500) to view it in your browser.

Any changes made will restart the development server.

### `npm run serve`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Any changes made will restart the development server.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
