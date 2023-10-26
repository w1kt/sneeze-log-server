import jwt from 'jsonwebtoken';
import db from '../db';
import UserService from './User';

const Public = {
  getDeleteAccountPage() {
    const apiUrl = `${process.env.API_URL}`
    return `
      <html>
        <head>
          <title>Loggable Delete Account</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> 
          <script type="text/javascript" src="/javascripts/public.js"></script>
        </head>
        <body>
          <img width="50" src="/images/logo.png" />
          <span style="font-size: 23px; font-family:sans-serif;top: -14px;position: relative;">Loggable - account deletion</span>
          <p>Please verify your email address.</br>You will receive an email with a link to delete your account.</p>
          <div id="error" style="color: red"></div>
          <input id="email" type="email" />
          <button id="submit" onclick="sendDeletionEmail('${apiUrl}')">Submit</button>
          <img id="loading" src="/images/loading.gif" width="20px" style="margin-bottom:-6px; display:none" />
          <p id="response" style="display:none"></p>
        </body>
      </html>
    `
  },
  async getDeleteAccountConfirmedPage(token) {
    const decoded = await jwt.verify(token, process.env.ACCOUNT_SECRET);
    await UserService.delete(decoded.userId);
    return 'Your Loggable account and data have been deleted';
  }
}

export default Public;