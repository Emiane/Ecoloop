export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  let statusCode = 500
  let message = 'Erreur interne du serveur'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Données invalides'
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Token invalide'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expiré'
  } else if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    statusCode = 409
    message = 'Cette donnée existe déjà'
  } else if (err.message) {
    message = err.message
    statusCode = err.statusCode || 500
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
