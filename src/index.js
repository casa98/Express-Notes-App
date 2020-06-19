const express = require('express');
const app = express();

// SETTINGS
app.set('port', process.env.PORT || 3000);  // If a default port (cloud services maybe), use it, else, 3000

// MIDDLEWARES

// GLOBAL VARIABLES

// ROUTES

// STATIC FILES

// SERVER LISTENING
app.listen(app.get('port'), ()=>{
    console.log("Server listening on port", app.get('port'));
})