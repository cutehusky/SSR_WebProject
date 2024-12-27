import passport from 'passport';
import Google from 'passport-google-oauth2';
import dotenv from 'dotenv';

dotenv.config();
const GoogleStrategy = Google.Strategy;

/** PORT is 3000 */
/** Go to website: google credentials to create your own GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET */

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true,
        },
        function (
            request: any,
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) {
            done(null, profile);
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});
