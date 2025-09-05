// passport-setup.js
import passport from 'passport';
import { User } from '../models/userSchema.js';
import dotenv from "dotenv";
dotenv.config();
import GoogleStrategy from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
        return done(null, existingUser);
    }

    const role = profile._json.session?.role || 'student';
    const newUser = await new User({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        role: 'student', // Default role or based on your logic
        googleId: profile.id
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
