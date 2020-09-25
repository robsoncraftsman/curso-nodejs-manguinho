export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/curso-node-manguinho',
  PORT: process.env.PORT ?? 3000,
  SALT: 12
};
