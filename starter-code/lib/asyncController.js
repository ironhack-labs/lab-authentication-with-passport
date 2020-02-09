const asyncController = controllerPromise => {
  return (req, res, next) => {
    controllerPromise(req, res, next).catch(e => next(e));
  };
};

module.exports = asyncController;
