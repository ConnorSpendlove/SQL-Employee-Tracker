# SQL Employee Tracker

## Description

The SQL Employee Tracker is a command-line application that allows users to manage a company's employee database. It provides functionality to view all departments, roles, and employees, add new departments, roles, and employees, and update employee roles. This application is useful for businesses to efficiently manage their workforce data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Walkthrough Video](#walkthrough-video)
- [License](#license)

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the necessary dependencies.

### Setting up the Database

1. Make sure you have MySQL installed on your machine.
2. Enter db/connection.js and change the password to your MySQL password.
3. Open the MySQL terminal by typing `mysql -u root -p` in the terminal.
4. Source the schema by running `source db/schema.sql` in your MySQL client.
5. Optionally, run `source db/seeds.sql` to seed some data into the database.

## Usage

1. After installing dependencies and setting up the database, run `node server.js` in your terminal to start the application.
2. Follow the prompts to select the desired action from the main menu.
3. Use the arrow keys to navigate through the options and press Enter to make a selection.

## Walkthrough Video

https://www.youtube.com/watch?v=aruzzzlW-PE

## License

This project is licensed under the [MIT License](LICENSE).
