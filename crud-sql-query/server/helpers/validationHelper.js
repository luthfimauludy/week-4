const Joi = require("joi");
const Boom = require("boom");

exports.categoryListData = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().description("Name cannot be empty!"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

exports.eventListData = (data) => {
  const schema = Joi.object({
    title: Joi.string().optional().description("Title cannot be empty!"),
    descriptions: Joi.string()
      .optional()
      .description("Descriptions cannot be empty!"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};
