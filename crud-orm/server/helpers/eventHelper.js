const _ = require("lodash");
const Boom = require("boom");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/eventHelper.js";

exports.getAllEvent = async (dataObject) => {
  const { limit, offset } = dataObject;

  try {
    const events = await db.Events.findAll({
      limit,
      offset,
    });

    return Promise.resolve(events);
  } catch (err) {
    console.log([fileName, "getAllEvent", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.getOneEvent = async () => {
  try {
    const oneEvent = await db.Events.findOne({
      attributes: ["id", "title", "descriptions"],
      include: "cities",
    });

    return Promise.resolve(oneEvent);
  } catch (err) {
    console.log([fileName, "getOneEvent", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.insert = async (dataObject) => {
  const { title, descriptions, cityId } = dataObject;

  try {
    const event = await db.Events.findOne({
      where: { title },
    });
    if (!_.isEmpty(event)) {
      return Promise.reject(Boom.badRequest("TITLE_HAS_BEEN_USED"));
    }

    const events = await db.Events.create({ title, descriptions, cityId });
    return Promise.resolve(events);
  } catch (err) {
    console.log([fileName, "insert", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.update = async (dataObject) => {
  const { title, descriptions, cityId } = dataObject;
  let response = {};

  try {
    const events = await db.Events.update({
      title,
      descriptions,
      cityId,
    });
    if (!events) {
      response = {
        success: false,
        message: "Update event unsuccessfully",
      };
    }

    return Promise.resolve(events);
  } catch (err) {
    console.log([fileName, "update", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

exports.delete = async (dataObject) => {
  const { title, descriptions, cityId } = dataObject;
  let response = {};

  try {
    const events = await db.Events.destroy({
      title,
      descriptions,
      cityId,
    });
    if (!events) {
      response = {
        success: false,
        message: "Delete event unsuccessfully",
      };
    }

    return Promise.resolve(events);
  } catch (err) {
    console.log([fileName, "update", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
