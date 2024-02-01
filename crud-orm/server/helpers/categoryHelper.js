const _ = require("lodash");
const Boom = require("boom");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/categoryHelper.js";

exports.getAllCategory = async (dataObject) => {
  const { limit, offset } = dataObject;

  try {
    const categories = await db.Categories.findAll({
      limit,
      offset,
    });

    return Promise.resolve(categories);
  } catch (err) {
    console.log([fileName, "getAllCategory", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.insert = async (dataObject) => {
  const { name } = dataObject;

  try {
    const category = await db.Categories.findOne({
      where: { name },
    });
    if (!_.isEmpty(category)) {
      return Promise.reject(Boom.badRequest("NAME_HAS_BEEN_USED"));
    }

    const categories = await db.Categories.create({ name });
    return Promise.resolve(categories);
  } catch (err) {
    console.log([fileName, "getAllCategory", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
