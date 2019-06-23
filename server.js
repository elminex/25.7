const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');

const app = express();
let googleProfile = {};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, cb) => {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
    cb(null, profile);
    }
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('assets'));

app.get('/', (req,res) => {
    res.render('index', { user: req.user });
});

app.get('/logged', (req, res) => {
    res.render('logged-in', { user: googleProfile });
});
app.get('/auth/google', passport.authenticate('google', {
    scope : ['profile', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/logged',
    failureRedirect: '/'
}));

const server = app.listen(3000, 'localhost', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Przykładowa aplikacja nasłuchuje na http://${host}:${port}`);
});
app.use(function (req, res, next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!')
});