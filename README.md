# Youtube-fetcher
An API to fetch latest videos from youtube sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.  

The server fetches latest videos async after every 10 minutes and saves it to the db.  

A search API is made which searches the required data in our db and if present then returns it otherwise it fetches that data from youtube-API and returns it.  

This project is completely based on ES6, Node.js/Express.js and MongoDB/Mongoose.

## Setup Guide
- Clone the project  
- As this project is based on Node.js and mongoDB you have to download Node.js, Npm and MongoDB as prerequisites  
- Go the project through the terminal and install all dependencies by   
  - npm init
  - npm install -g nodemon
  - npm i express mongoose axios body-parser
 - Inside the app.js file, fill the url with <your api key>
 - For getting an API key follow (https://developers.google.com/youtube/v3/getting-started / https://console.cloud.google.com/apis/dashboard)
 - run the server using nodemon app.js

## Parameters on Postman
  - Select post method on Postman 
  - Write localhost:3000 in the url section
  - In the key column enter three keys namely title, description and page and their corresponding values  
## Screenshots
  ![screenshot Postman](https://user-images.githubusercontent.com/62804076/163976618-fd3d5d46-fbd1-4bfc-89ec-0e15b964e801.png)

