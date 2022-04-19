# Youtube-fetcher
An API to fetch latest videos from youtube sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.  

The server fetches latest videos async after every 10 minutes and saves it to the db.  

A search API is made which searches the required data in our db and if present then returns it otherwise it fetches that data from youtube-API and returns it.  

This project is completely based on ES6 and Node.js.
