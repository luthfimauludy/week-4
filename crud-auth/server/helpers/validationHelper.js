const Joi = require("joi");
const Boom = require("boom");

exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().description("Name cannot be empty"),
    email: Joi.string().required().description("Email cannot be empty"),
    password: Joi.string()
      .min(8)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Email cannot be empty"),
    password: Joi.string()
      .min(8)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

exports.forgotValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Email cannot be empty"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

exports.resetValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string().required().description("Code cannot be empty"),
    email: Joi.string().required().description("Email cannot be empty"),
    password: Joi.string()
      .min(8)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};
