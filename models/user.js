const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { urlRegExp } = require('../urlRegExp');
const UnauthorizedError = require('../errors/Unauthorized');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Некорректный email',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => urlRegExp.test(url),
        message: 'Требуется ввести url',
      },
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this
          .findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password)
                .then((matched) => {
                  if (matched) return user;

                  throw new UnauthorizedError('Неправильные почта или пароль');
                });
            }

            throw new UnauthorizedError('Неправильные почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
