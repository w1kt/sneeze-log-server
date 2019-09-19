import nodemailer from 'nodemailer';

const PasswordRecovery = {
  async getVCode(req, res) {
    const auth = {
     type: 'OAuth2',
     user: 'loggableapp@gmail.com',
     clientId: process.env.EMAIL_CLIENT_ID,
     clientSecret: process.env.EMAIL_CLIENT_SECRET,
     refreshToken: process.env.EMAIL_REFRESH_TOKEN
   }
   let transporter = nodemailer.createTransport({
     service: 'gmail',
     auth
   });
   const mailOpts = { 
    from: 'Loggable <noreply@loggable-app.com>',
    to: req.userEmail,
    subject: 'test',
    text: 'this is a test',
    html: '<p>this is a test</p>'
   }
  transporter.sendMail(mailOpts, (err, res) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(JSON.stringify(res))
    }
  })
  }
}
 export default PasswordRecovery;