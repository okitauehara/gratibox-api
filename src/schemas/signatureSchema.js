import joi from 'joi';

const signatureSchema = joi.object({
  delivery_date: joi.string().valid('monday', 'wednesday', 'friday', 'day 01', 'day 10', 'day 20').required(),
  products: joi.array().items(joi.string().length(1).valid('1', '2', '3').required()),
  cep: joi.string().length(8).pattern(/^[0-9]+$/).required(),
  number: joi.number().integer().required(),
  full_name: joi.string().required(),
});

export default signatureSchema;
