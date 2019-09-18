import UserService from "../services/User";
import Helpers from "../utils/Helpers";
import { NoRecordFoundError } from "../utils/CustomErrors";
import nodemailer from "nodemailer";

const User = {
  /**
   * Registers a new user account via the User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async register(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Username or password missing" });
    }
    if (!Helpers.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address" });
    }

    try {
      const token = await UserService.register(
        req.body.email,
        req.body.password
      );
      return res.status(201).send({ token });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  /**
   * Logs user in via User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Username or password missing" });
    }
    if (!Helpers.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address" });
    }
    try {
      const token = await UserService.login(req.body.email, req.body.password);
      return res.status(200).send({ token });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  /**
   * Delete the user associated with the JWT in request.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   */
  async delete(req, res) {
    try {
      await UserService.delete(req.user.id);
      return res.status(204).send({ message: "User deleted" });
    } catch (error) {
      let statusCode = 400;
      if(error instanceof NoRecordFoundError) {
        statusCode = 404;
      }
      return res.status(statusCode).send({ message: error.message });
    }
  },
  async forgotPassword(req, res) {
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
    to: 'jbsmith4491@gmail.com',
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
};

export default User;
