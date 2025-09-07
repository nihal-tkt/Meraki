import passport from 'passport';
import { User } from '../models/userSchema.js';
import FacebookStrategy from 'passport-facebook';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;


export default passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'] // specify fields you want to fetch
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ facebookId: profile.id });
    if (existingUser) {
        return done(null, existingUser);
    }
    const newUser = await new User({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        role: 'student', // Default role or based on your logic
        facebookId: profile.id,
    }).save();
    done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

