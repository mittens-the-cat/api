module.exports = (message, status = 500) => {
  const err = new Error()

  err.message = message
  err.status = status

  return err
}
