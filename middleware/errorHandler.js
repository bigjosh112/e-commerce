//not found

// exports.notFound = (req, res, next ) => {
//     const error = new Error(`Not found : ${req.orginalUrl}`);
//     res.status(404);
//     next(error);
// };



// //error handler

// exports.errorHandler = (err, req, res, next) => {
//     const statuscode = res.statuscode == 200 ? 500 : res.statuscode;
//     res.status(statuscode);
//     res.json({
//          message: err?.message,
//         stack: err?.stack
//      });
// };



exports.ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}


//module.export = { errorHandler, notFound}