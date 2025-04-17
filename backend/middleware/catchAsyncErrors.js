module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

//   function catchAsyncErrors(theFunc) {
//     return function(req, res, next) {
//       // Wrap the async function in a Promise to handle async errors
//       Promise.resolve(theFunc(req, res, next)).catch(next);
//     };
//   }
