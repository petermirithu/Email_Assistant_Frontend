var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('cookie-session');

require('dotenv').config()

var app = express();

var index = require('./routes/index');
var apis = require('./routes/apis');

const NodeMailListener = require('./utils/mailListener');
// const mailListener = new NodeMailListener();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'wosdwswdwdwdwqdwqddhjh%$$qwdwssdfsfdsdsfsdfsdfdsfdqdqwot',
    resave: false,
    saveUninitialized: false
}));

// express-messages middleware for flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.errors = req.flash("error");
    res.locals.warnings = req.flash("warning");
    res.locals.infos = req.flash("info");
    res.locals.successes = req.flash("success");
    next();
});


app.use('/', index);
app.use('/apis', apis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
        message: err.message,
        error: {}
    });
});

const server = app.listen(3000, () => console.log(`Express server listening on port 3000`));

module.exports = app;