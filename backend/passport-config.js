/* const LocalStrategy = require ('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail){
    const authenticateUser = (email, passport, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compareSync(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }

    }
    passport.use(new LocalStrategy( {usernameField: 'email'} ), 
    authenticateUser)
    passport.serializeUser((user, done) => {  })
    passport.deserializeUser((id, done) => {  })
}

moudule.exports = initialize */