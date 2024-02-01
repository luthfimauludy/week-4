const _ = require("lodash");
const Boom = require("boom");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/cityHelper.js";

exports.getAllCity = async (dataObject) => {
  const { limit, offset } = dataObject;

  try {
    const cities = await db.Cities.findAll({
      limit,
      offset,
    });

    return Promise.resolve(cities);
  } catch (err) {
    console.log([fileName, "getAllCity", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.insert = async (dataObject) => {
  const { name } = dataObject;

  try {
    const event = await db.Cities.findOne({
      where: { name },
    });
    if (!_.isEmpty(event)) {
      return Promise.reject(Boom.badRequest("NAME_HAS_BEEN_USED"));
    }

    const cities = await db.Cities.create({ name });
    return Promise.resolve(cities);
  } catch (err) {
    console.log([fileName, "insert", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
