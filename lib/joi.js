const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {

            const result = Joi.validate(req.body, schema);

            // console.log('_joi result => ', result)

            if(result.error){
                return res.status(400).json(result.error);
            }

            next();
        }
    },

    schemas: {
        add: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string()
                .regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                .required(),
            pass: Joi.string().required(),
            picture: Joi.string().required(),
            tel: Joi.string().required(),
        }),
        signin: Joi.object().keys({
            email: Joi.string()
                .regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                .required(),
            pass: Joi.string().required()
        }),
        update: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            picture: Joi.string(),
            tel: Joi.string()
        })
    }
}