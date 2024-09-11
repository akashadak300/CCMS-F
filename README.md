# College Counselling Management System

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Future Enhancements](#future-enhancements)



---

## Project Overview
The **College Counselling Management System** is a web-based platform designed to assist students in choosing the right college and branch based on their academic performance, preferences, and predicted ranks. It provides features for predicting college cutoffs, branch availability, and a thorough analysis of previous years' cutoffs to guide students through the counseling process.

## Features
- **View Colleges and Branches**: A comprehensive list of colleges and branches is displayed to users.
- **Rank Prediction**: Predict a student's rank based on their performance.
- **College Prediction**: Suggests possible colleges based on the predicted rank.
- **Cutoff Analysis**: Analyze and view cutoffs of previous years to help make informed decisions.
- **User-friendly Interface**: Easy navigation and responsive design for better user experience.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, EJS (Embedded JavaScript)
- **Database**: MySQL
- **Version Control**: Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akashadak300/CCMS-F.git
   cd college-counselling-management-system
   ```

2. **Install dependencies**
   Ensure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Set up MySQL database**
   Set up your MySQL database as per the instructions in the [Database Setup](#database-setup) section.

4. **Run the application**
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

## Usage
- Visit `http://localhost:3000` in your browser.
- View colleges, branches, and cutoff details.
- Predict your rank and get suggestions on potential colleges and branches.
- Use cutoff analysis to explore trends and make informed decisions.

## Database Setup
1. **Create a MySQL database**:
   ```sql
   CREATE DATABASE ccms-schema;
   ```
2. **Create tables**:
- use the csv files present in ccms-schema to export tables in the database using mysql wizard-



## Future Enhancements
- **User Authentication**: Implement login and registration for students and administrators.
- **Counseling Scheduling**: Enable users to schedule counseling sessions.
- **Advanced Analytics**: Integrate more advanced prediction models and tools for decision-making.


