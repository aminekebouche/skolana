import Logging from './library/Logging';
import http from 'http';
import app from './app';

const errorHandler = (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + app.get('port');
    switch (error.code) {
        case 'EACCES':
            Logging.error(bind + ' requires elevated privileges.');
            process.exit(1);
        case 'EADDRINUSE':
            Logging.error(bind + ' is already in use.');
            process.exit(1);
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + app.get('port');
    Logging.info('Listening on ' + bind);
});

server.listen(app.get('port'));
