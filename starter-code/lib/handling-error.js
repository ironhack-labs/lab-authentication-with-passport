const error = (err, req, res, next) => {
  console.error("ERROR", req.method, req.path, err);

  if (!res.headersSent) {
    res.status(500);
    res.render("error");
  }
};

const notFound = (req, res, next) => {
  res.status(404);
  res.render('errors/not-found');
}

module.exports = {
  error,
  notFound
}