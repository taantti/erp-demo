/*
Validointivirheiden käsittely error middleware:ssa
Kun Mongoose-validointi epäonnistuu, se luo ValidationError-tyyppisen virheen, joka sisältää 
yksityiskohtaiset tiedot jokaisesta epäonnistuneesta kentästä. Voit käsitellä nämä virheet 
error middleware:ssä ja muotoilla vastauksen haluamallasi tavalla.

*/
/*
1. Mongoose ValidationError -rakenne
Mongoose ValidationError on objekti, jolla on seuraava rakenne:
{
  name: 'ValidationError',
  message: 'Validation failed',
  errors: {
    email: {
      name: 'ValidatorError',
      message: 'test@example.com ei ole kelvollinen sähköpostiosoite!',
      kind: 'user defined',
      path: 'email',
      value: 'test@example.com'
    },
    // Muut kentät joiden validointi epäonnistui
  }
}

2. Error middleware
Tässä on esimerkki error middleware:sta, joka käsittelee Mongoose ValidationError -virheitä:
*/
// middleware/errorHandler.js

/**
 * Globaali virheenkäsittelijä middleware
 */
const validationErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  // Mongoose ValidationError käsittely
  if (err.name === 'ValidationError') {
    const validationErrors = {};
    Object.keys(err.errors).forEach(field => {
      validationErrors[field] = err.errors[field].message;
    });
    // Lisää kenttäkohtaiset virheet virheobjektiin
    err.statusCode = 400;
    err.validationErrors = validationErrors;
    err.message = 'Validation failed';
    return next(err);
  }
  // Mongoose CastError (esim. virheellinen ObjectId)
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
    return next(err);
  }
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 409;
    err.message = `${field} already exists with value: ${err.keyValue[field]}`;
    return next(err);
  }
  return next(err); // Siirrytään seuraavaan error middlewareen
}

export default validationErrorHandler;
