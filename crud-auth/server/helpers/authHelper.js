const Boom = require("boom");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";
const fileName = "server/helpers/authHelper.js";
const salt = bcrypt.genSaltSync(10);

// eslint-disable-next-line arrow-body-style
const __hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

// eslint-disable-next-line arrow-body-style
const __comparePassword = (payloadPass, dbPass) => {
  return bcrypt.compareSync(payloadPass, dbPass);
};

// eslint-disable-next-line arrow-body-style
const __generateToken = (data) => {
  return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
};

exports.register = async (dataObject) => {
  const { name, email, password } = dataObject;

  try {
    const user = await db.Users.findOne({
      where: { email },
    });
    if (!_.isEmpty(user)) {
      return Promise.reject(Boom.badRequest("EMAIL_HAS_BEEN_USED"));
    }

    const hashedPass = __hashPassword(password);
    await db.Users.create({ name, email, password: hashedPass });

    return Promise.resolve({
      success: true,
      message: "Register successfully",
    });
  } catch (err) {
    console.log([fileName, "register", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.login = async (dataObject) => {
  const { email, password } = dataObject;

  try {
    const user = await db.Users.findOne({
      where: { email },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    const isPassMatched = __comparePassword(password, user.password);
    if (!isPassMatched) {
      return Promise.reject(Boom.badRequest("WRONG_CREDENTIALS"));
    }

    const token = __generateToken({
      email: user.email,
      password: user.password,
    });

    return Promise.resolve({
      success: true,
      message: "Login successfully",
      results: user,
      token,
    });
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.forgot = async (dataObject) => {
  const { email } = dataObject;
  try {
    const user = await db.Users.findOne({
      where: { email },
    });
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    const randomNumber = Math.random();
    const rounded = Math.round(randomNumber * 100000);
    const padded = String(rounded).padEnd(6, "0");

    const forgot = await db.forgot_requests.create({
      email: user.email,
      code: padded,
    });
    if (!_.isEmpty(forgot)) {
      return Promise.reject(Boom.badRequest("FORGOT_FAILED"));
    }
    return Promise.resolve({
      success: true,
      message: "Forgot password successfully",
    });
  } catch (err) {
    console.log([fileName, "forgot", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.reset = async (dataObject) => {
  const { code, email, password } = dataObject;

  try {
    const find = await db.forgot_requests.findOne({
      where: { email, code },
    });
    if (!_.isEmpty(find)) {
      return Promise.reject(Boom.badRequest("NO_FORGOT_REQUEST"));
    }

    const selectedUser = await db.Users.findOne({
      where: { email },
    });
    const hashedPass = __hashPassword(password);
    const user = await db.Users.update(selectedUser.id, hashedPass);
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }
    await db.forgot_requests.destroy(find.id);
    return Promise.resolve({
      success: true,
      message: "Reset password successfully",
    });
  } catch (err) {
    console.log([fileName, "reset", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
