const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');

// SETTINGS
app.set('port', process.env.PORT || 3000);  // If a default port (cloud services maybe), use it, else, 3000
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
    })
);


app.set('view engine', '.hbs');


// MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));


// GLOBAL VARIABLES

// ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/user'));

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// SERVER LISTENING
app.listen(app.get('port'), ()=>{
    console.log("Server listening on port", app.get('port'));
})