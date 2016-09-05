function setupAuth(User, app, Config) {
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.
            findOne({ _id : id}).
            exec(done);
    });

    passport.use(new FacebookStrategy(
        {
            clientID: Config.facebookClientId,
            clientSecret: Config.facebookClientSecret,
            callbackURL: 'http://localhost:3001/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name']
        },
        function(accessToken, refreshToken, profile, done) {

            if (!profile.emails || !profile.emails.length) {
                return done('No emails associated with this account!');
            }

            User.findOneAndUpdate(
                { 'data.auth' : profile.id},
                {
                    $set: {
                        'profile.username' : profile.emails[0].value,
                        'profile.picture' : 'http://graph.facebook.com/' + 
                            profile.id.toString() + '/picture?type=large'
                    }
                },
                { 'new' : true, upsert: true, runValidators: true},
                function (error, user) {
                    done(error, user);
                }
            );
        }
    ));

    //Express Middlewares
    app.use(require('express-session')({
        secret: 'this is a secret'
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    //Express routes for auth
    app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { faliureRedirect: '/fail' }),
        function (req, res){
            res.send('Welcome, ' + req.user.profile.username);
        }
    );
}

module.exports = setupAuth;
