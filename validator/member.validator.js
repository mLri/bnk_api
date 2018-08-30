const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {

            const result = Joi.validate(req.body, schema);

            if(result.error){
                return res.status(400).json(result.error);
            }

            next();
        }
    },

    schemas: {
        add: Joi.object().keys({
            firstName: Joi.object({
                th: Joi.string().required(),
                en: Joi.string().required()
            }).required(),
            lastName: Joi.object({
                th: Joi.string().required(),
                en: Joi.string().required()
            }).required(),
            birth: Joi.string().required(),
            height: Joi.string().required(),
            province: Joi.string().required(),
            like: Joi.string().required(),
            blood: Joi.string().required(),
            hobby: Joi.string().required(),
            avatar: Joi.object({
                name: Joi.string().required(),
                path: Joi.string().required(),
                size: Joi.string().required(),
            }).required(),
            gen: Joi.string().required(),
            nickName: Joi.string().required(),
        })
    }
}