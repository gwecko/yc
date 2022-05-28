const joiBaseCode = require('joi');
const sanitizeHtml = require('sanitize-html');
// const { number, string } = require('joi');


// Extension was was copied. Unaware of all the syntax. 
// "Cleans" any user-entered html to prevent security risk
const extension = (joiBaseCode) => ({
    type: 'string',
    base: joiBaseCode.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML.'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const cleaned = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (cleaned !== value) return helpers.error('string.escapeHTML', {value})
            }
        }
    }
});


const joi = joiBaseCode.extend(extension);


// We put our '.escapeHTML()' anyplace with text entry
module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        //image: joi.string().required(),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
});