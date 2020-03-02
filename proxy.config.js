const proxy = [
    {
      context: '/BPAManagement11',
      target : 'http://10.248.0.51:9708',
      pathRewrite : {
        '^/BPAManagement': ''
      },
      changeOrigin: true
    }
  ];
  module.exports = proxy;