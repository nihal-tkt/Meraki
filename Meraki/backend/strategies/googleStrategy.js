// passport-setup.js
import passport from 'passport';
import { User } from '../models/userSchema.js';
import dotenv from "dotenv";
dotenv.config();
import GoogleStrategy from 'passport-google-oauth20';



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
