# Board Games Recommendation App

## Table of Contents
- [Project Overview](#project-overview)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
  - [Login and Signup](#login-and-signup)
  - [Admin Dashboard](#admin-dashboard)
  - [User Preferences](#user-preferences)
  - [Homepage Sections](#homepage-sections)
  - [Game Details](#game-details)
  - [Account Management](#account-management)
- [Contributing](#contributing)

## Project Overview
This repository contains a React app, an Express app, and a MySQL database. The React app serves as the frontend, while the Express app acts as the backend API. The MySQL database stores the application's data.

## Installation
  Clone the repository:
  ```bash
  git clone https://github.com/Milanka81/board-games.git
  ```
* To start the application, follow these steps:

1. Start the React app:
   - Open a terminal.
   - Navigate to the React app directory:
     ```bash
     cd react-games
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React app:
     ```bash
     npm start
     ```
   The React app will be accessible at [http://localhost:3000](http://localhost:3000).

 2. Start the Express app:
   - Open another terminal.
   - Navigate to the Express app directory:
     ```bash
     cd node-games
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Express app:
     ```bash
     nodemon app
     ```
   The Express app will be accessible at [http://localhost:3001](http://localhost:3001).

Make sure to start both the React app and the Express app in separate terminals to keep them running simultaneously. This will allow the frontend and backend to communicate properly.



## Database Setup
To set up the MySQL database for this project, follow these steps:
1. Create a new MySQL database using your preferred MySQL management tool (e.g., MySQL Workbench).
2. Import the database schema gamesDB.sql:
   - MySQL Workbench > Server > Data Import > Import from Self-Contained File
3. Update the database configuration in the Express app:
   - Open the file `express-app/config/database.js` and replace the placeholders with your MySQL database credentials.

## Usage

### Login and Signup
When users land on the web app, they will be presented with a login/signup screen that offers the following options:
1. Login (username/password)
2. Sign up
3. Forgot password

### Admin Dashboard
Admin users have access to the following sections on the homepage:
1. Boardgames:
   - Admin can view, add, update, and delete board games in the system.
   - The board games can be searched using various criteria.
2. Users:
   - Admin can view, update, and delete users in the system.
   - User data can be searched using various criteria.

### User Preferences
When a new user visits the homepage for the first time, they will be greeted with a form to enter preferences for board games. Preferences include type/categories, designer(s), artist(s), number of players, and game length/time.

### Homepage Sections
The homepage displays multiple sections of games:
- Recommended
- Favourites
- New
- Most Liked
- All
Games in these sections are represented with images, which expand on hover to show more information about the game. Users can search for particular board games using various criteria.

### Game Details
Users can click on each game to bring up a more detailed view. In this view, users can rate the game, add it to favourites, view/add comments, and opt-in to receive emails when new games that fit their criteria are added.

### Account Management
Both admin and user roles can see their own account details and update them. Users can also update their preferences about games.
Information for users:
- Username/Password
- Email
- Games preferences
- Email subscription

Information for games:
- Name
- Image(s)
- Designer(s)
- Artist(s)
- Year
- Number of Players
- Game Length
- Categories/Tag

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue.

