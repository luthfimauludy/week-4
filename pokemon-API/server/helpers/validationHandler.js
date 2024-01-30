const Joi = require("joi");
const Boom = require("boom");

const pokeDetailValidation = (data) => {
  const schema = Joi.object({
    pokemonName: Joi.string()
      .optional()
      .description("Pokemon name; i.e. Bulbasaur"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = { pokeDetailValidation };
