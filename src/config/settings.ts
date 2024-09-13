const appConfig = {
  server: {
    port: parseInt(process.env.SERVER_PORT),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    authDuration: process.env.JWT_AUTH_TOKEN_DURATION,
  },
  hashing: {
    bcryptSalt: parseInt(process.env.BCRYPT_HASHING_SALT),
  },
  encryption: {
    salt: process.env.ENCRYPTION_SALT,
    secretKey: process.env.ENCRYPTION_SECRET_KEY,
    algorithm: process.env.ENCRYPTION_ALGORITHM,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};

export default appConfig;
