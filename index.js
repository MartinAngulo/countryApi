const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const {getAllCountries} = require('./src/sync/index.js');



// Syncing all the models at once.
conn.sync({ force: true })
.then(async ()=>await getAllCountries())
.then(() => {
  server.listen(process.env.PORT||3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
