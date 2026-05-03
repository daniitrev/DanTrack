const PROXY_CONFIG = {
    context: ['/api/v1/auth/'],
    target: 'http://localhost:51212',
    changeOrigin: true,
    loglevel: 'debug',
};

export default PROXY_CONFIG;
