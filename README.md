
# SimpleForum

SimpleForum is a web application where users can interact by registering, logging in, and logging out. The application allows users to create, edit, and delete posts, search for posts, and follow or un-follow other users. Additionally, users can chat with others who are online.

This README is also available in [Chinese](README_CN.md).

This is a [demo](https://simpleforum-2.onrender.com/)

## Features

- User registration and authentication.
- Create, edit, and delete posts.
- Search for posts.
- Follow and un-follow users.
- Real-time chat with other users.

## ScreenShots

### Login

![login](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-login.gif)

### Posts

![posts](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-posts.gif)

### Search and Follow

![search and follow](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-searchAndFollow.gif)

### Chat

![chat](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-chat.gif)

## Technology Stack

- JavaScript
- Node.js with Express
- EJS for templating
- Webpack and Babel for building and transpiling
- MongoDB for database
- Socket.io for real-time communication

## Prerequisites

To run SimpleForum on your local machine, you need to have Node.js and npm installed. You can download and install them from [Node.js official website](https://nodejs.org/).

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/yourgithub/simpleforum.git
cd simpleforum
npm install
```

## Configuration

Before running the application, you must set up your environment variables. Create a .env file in the root directory and provide the following configurations:

```text
DB_USERNAME=yourMongoDBUsername
DB_PASSWORD=yourMongoDBPassword
DB_HOST=yourMongoDBHost
APP_NAME=SimpleForum
DB_COLLECTION=yourCollectionName
DB_NAME=yourDatabaseName
```

## Running the Application

To start the application, run the following command in the terminal:

```bash
npm run watch
```

This command will start the Node.js server and set up Webpack to watch for any changes in your source files.

## Usage

Navigate to [http://localhost:3001](http://localhost:3001) in your web browser to start using SimpleForum. Register an account to explore all features.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License

This script is open-source and free to use under the MIT license.
