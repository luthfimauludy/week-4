const _ = require("lodash");
const Boom = require("boom");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/userHelper.js";

exports.getAllUser = async (dataObject) => {
  const { limit, offset } = dataObject;

  try {
    const users = await db.Users.findAll({
      limit,
      offset,
    });

    return Promise.resolve(users);
  } catch (err) {
    console.log([fileName, "getAllUser", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.getDetailUser = async (id) => {
  try {
    const user = await db.Users.findByPk(id, {
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    return Promise.resolve(user);
  } catch (err) {
    console.log([fileName, "getDetailUser", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.update = async (id, data) => {
  try {
    const { name, email } = data;
    const user = await db.Users.update({ name, email }, { where: { id } });
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    return Promise.resolve(user);
  } catch (err) {
    console.log([fileName, "update", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
