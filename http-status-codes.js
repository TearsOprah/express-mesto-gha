const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE_UNAUTHORIZED = 401;

const errorsHandler = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: `Ошибка ${ERROR_CODE_BAD_REQUEST}.` });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные.' });
  }

  return res
    .status(ERROR_CODE_INTERNAL_SERVER_ERROR)
    .send({ message: `Ошибка сервера ${ERROR_CODE_INTERNAL_SERVER_ERROR}` });
};

module.exports = {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE_UNAUTHORIZED,
  errorsHandler,
};
