const { createApp } = require('./app');
const appDataSource = require('./models/appDataSource');

const app = createApp();

const startServer = async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is listening on 127.0.0.1 ${PORT}`));
};

startServer();
