const app = require('./app'); // the actual Express application
const http = require('http');
const logger = require('./utils/logger');
const config = require('./utils/config');
const server = http.createServer(app);

const port = config.PORT || 3001;
server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
