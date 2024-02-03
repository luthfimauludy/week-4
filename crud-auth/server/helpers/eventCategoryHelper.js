const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/eventCategoryHelper.js";

exports.insert = async (dataObject) => {
  const { eventId, categoryId } = dataObject;

  try {
    const eventCategories = await db.Event.Categories.create({
      eventId,
      categoryId,
    });
    return Promise.resolve(eventCategories);
  } catch (err) {
    console.log([fileName, "insert", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};
