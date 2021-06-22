const Joi=require("joi");

const states=["done","todo"];
module.exports={
    create:{
        body:Joi.object({
            _id:Joi.forbidden,
            title:Joi.string().required(),
            state: Joi.string()
              .valid(...states),
            point: Joi.number().optional(),
        }),
    }
};