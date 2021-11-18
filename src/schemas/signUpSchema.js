import joi from 'joi';

const signUpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: joi.string().min(8).required(),
});

export default signUpSchema;
