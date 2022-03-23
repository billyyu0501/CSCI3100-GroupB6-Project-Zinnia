/* const nodemailer = require('nodemailer');
const router = require('./routes/register');

router.sendConfirmationEmail = function(toUser, hash){
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD
            }
        })
        const message = {
            from: process.env.AUTH_EMAIL,
            //to: User.email,
            to: process.env.AUTH_EMAIL,
            subject: 'Your App - Activate Account',
            html:
              <h3>Hello </h3>
        }
    })
} */