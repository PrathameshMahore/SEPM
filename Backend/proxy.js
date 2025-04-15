const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // rewrite path
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
};

// Use the proxy for all /api routes
app.use('/api', createProxyMiddleware(proxyOptions));

// Start the proxy server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 