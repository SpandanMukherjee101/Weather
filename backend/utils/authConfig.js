function getJwtSecret() {
  if (typeof process.env.JWT_SECRET === 'string' && process.env.JWT_SECRET.trim().length > 0) {
    return process.env.JWT_SECRET;
  }

  return 'dev-secret-change-me';
}

module.exports = {
  getJwtSecret,
};
