import * as Joi from 'joi';

export const joinValidation = Joi.object({
  MONGODB: Joi.string().required(),
  PORT: Joi.number().default(3002),
  DEFAULT_LIMIT: Joi.number().default(10),
});
