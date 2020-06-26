const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// INITIALIZATIONS
require('./database');
require('./config/passport');

// SETTINGS
app.set('port', process.env.PORT || 3000);  // If a default port (cloud services maybe), use it, else, 3000
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    handlebars: allowInsecurePrototypeAccess(handlebars),
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

//This has to go after the session middleware!!
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// GLOBAL VARIABLES
// I want that all view access flash messages, let's create a global variable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // Passport errors:
    res.locals.error = req.flash('error');

    res.locals.user = req.user || null;     // Global var for user, if not authenticated, null

    next();
});

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