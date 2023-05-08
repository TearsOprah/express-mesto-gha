const mongoose = require('mongoose');
const { urlRegExp } = require('../urlRegExp');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => urlRegExp.test(url),
        message: 'Требуется ввести url',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    likes: [{
      type: ObjectId,
      ref: 'user',
      default: [],
    }],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
