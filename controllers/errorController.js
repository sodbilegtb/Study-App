const httpStatus = require("http-status-codes");

exports.errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500)
    res.render("error", { error: err.name })
};

exports.pageNotFoundError = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error");
};

