# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).It allows users to shorten long URLs into easy-to-share, short URLs. Users can also manage their shortened URLs by registering and logging into the system.

## Final Product

!["screenshot of Login-page"](https://github.com/hinali/tinyapp/blob/master/docs/Login_page.png?raw=true)
!["screenshot of Register-page"](https://github.com/hinali/tinyapp/blob/master/docs/Register_page.png)
!["screenshot of Urls-page"](https://github.com/hinali/tinyapp/blob/master/docs/Urls_page.png)
!["screenshot of Urls_New-page"](https://github.com/hinali/tinyapp/blob/master/docs/Urls_New_page.png)
!["screenshot of Urls_ID-page"](https://github.com/hinali/tinyapp/blob/master/docs/Urls_ID_page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

To run this application locally, follow these steps:

- Clone this repository to your local machine.
- Install the required dependencies using npm install.
- Start the server using npm start.
- Access the application in your web browser at http://localhost:8080/.

## Features

- User Registration and Authentication: Users can register for an account and log in to access their URLs.
- Shorten URLs: Registered users can shorten long URLs.
- Manage URLs: Users can view, edit, and delete their shortened URLs.
- Redirection: Shortened URLs redirect users to the original long URLs.
- User-Friendly Interface: The web app provides a clean and intuitive user interface.
- Secure Password Storage: User passwords are securely hashed and stored in the database.