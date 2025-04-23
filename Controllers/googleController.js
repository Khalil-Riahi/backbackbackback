const User= require('./../Models/User')
const jwt=require('jsonwebtoken')
// // const {OAuth2Client} = require('google-auth-library')
const AppError=require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const signToken =id=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE_IN})
}

const createSendToken = (user, statusCode , res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly:true    
    }

    if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
    res.cookie('jwt',token,)
    // res.status(statusCode).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user
    //     }
    // })

}
const setupPassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/auth/google/callback",
                passReqToCallback: true
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile)
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        // Create a new user if not found

                        console.log('this is profile json: ')
                        // console.log(profile._json.phoneNumbers)
                        
                        user = await User.create({
                            googleId: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            // photo: profile.photos[0].value,
                            // phone: profile._json.phoneNumbers?.[0]?.value || 99999999

                            // phone: profile._json.phoneNumbers?.[0]?.value || 12345678
                            // password: "123456789",
                            // passwordConfirm: "123456789"
                        });

                        // createSendToken(user,201,res)

                    }else{

                        // const user1 ={
                        //     googleId: profile.id,
                        //     firstName: profile.name.givenName,
                        //     lastName: profile.name.familyName,
                        //     email: profile.email[0].value,
                        //     photo: profile.photos[0].value,
                        //     password: "123456789",
                        //     passwordConfirm: "123456789"
                        // }
                        console.log('this is profile json: ')
                        console.log(profile._json)

                        let updatedUser = {
                            googleId: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            photo: profile.photos[0].value,
                            // phone: profile._json.phoneNumbers?.[0]?.value || 99999999

                        }

                        await User.findOneAndUpdate(
                            {_id: user.id},
                            {$set: updatedUser},
                            {new: true}
                        )
                        console.log(updatedUser)

                        // const user2 = await User.create(user2)
                        // console.log(user2)
                        // user.googleId = profile.id
                        // user.firstName = profile.given_name,
                        // user.lastName =  profile.family_name,
                        // user.email = profile.emails[0].value,
                        // user.photo = profile.photos[0].value

                        // await user.save()
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
};

    
module.exports = {createSendToken , setupPassport}
