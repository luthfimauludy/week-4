const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/auth.js";

const register = async (req, res) => {
  try {
    Validation.registerValidation(req.body);

    const { name, email, password } = req.body;
    const response = await AuthHelper.register({ name, email, password });

    return res.send(response);
  } catch (err) {
    console.log([fileName, "register", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const login = async (req, res) => {
  try {
    Validation.loginValidation(req.body);

    const { email, password } = req.body;
    const response = await AuthHelper.login({ email, password });

    return res.send(response);
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const forgotPassword = async (req, res) => {
  try {
    Validation.forgotValidation(req.body);

    const { email } = req.body;
    const response = await AuthHelper.forgot({ email });

    return res.send(response);
  } catch (err) {
    console.log([fileName, "forgotPassword", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const resetPassword = async (req, res) => {
  try {
    Validation.resetValidation(req.body);

    const { code, email, password } = req.body;
    const response = await AuthHelper.reset({ code, email, password });

    return res.send(response);
  } catch (err) {
    console.log([fileName, "resetPassword", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

// eslint-disable-next-line arrow-body-style
const hello = async (req, res) => {
  // SAMPLE API WITH JWT MIDDLEWARE
  return res.send("Hello");
};

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password", resetPassword);
Router.get("/hello", Middleware.validateToken, hello);

module.exports = Router;
