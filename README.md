# CSPB3112_Project_Full_Stack_Website
Repository to hold my Full-Stack E-Commerce website created as part of CSPB 3112 - Professional Development

Project Description:
CSPB 3112 Semester Project - Full Stack E-Commerce Website (Daisy A Jewelery) - Full-Stack E-Commerce website allowing customers to purchase custom made jewelry.

Overview:
Objective of the CSPB 3112 course was in essence do a project over a topic we would like to learn about / promote our professional development. I chose to learn about Web Development as I have never been exposed to this area of computer science. Using my wife's hand-made jewelry side business as the motivation for the contents of the website 
I set out to learn about the fundamental technologies of web development. Without any prior experience, I was able to learn these technologies and create a functioning website in the course of a semester.

Features:
- Complete Customer Shopping Experience
- Site Owner Dashboard

Tech Stack:
- HTML/CSS
- JavScript
- Node.js
- Express.js
  - Packages - express-session, sqlite3, multer
- SQL
- SQLite Database

Installation & Usage:
- Install node.js (https://nodejs.org/en/download)
- Within the project directory, install necessary package dependencies for the Express server (https://docs.npmjs.com/cli/v6/commands/npm-install)
    - "express-session"
    - "sqlite3"
    - "multer"
- Navigate to the Server directory and, within the CLI, input the following command: node server.js
    - Now the server is running
  Go to your browser of choice and go to the following address: http://localhost:3000/
    - You should now be at the home page of the website 

Project Walkthrough
 - Video Demo (Project Walkthrough.mov)
 - Sample Transaction Walkthrough (name of file within the repository)


Future Improvements:
- Authentication / Authorization for site owners - For example, requiring log-in to access the user dashboard
- Implement additional security measures to ensure a secure shopping experience - Main focus for the project was to get the website functioning
- End goal is put this site online - Converting to a PostgreSQL database will be needed
- Implement the ability for the customer to provide payment information - will need to connect with a service such as Stripe
