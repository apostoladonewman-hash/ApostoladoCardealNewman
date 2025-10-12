module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.index',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/health/ready',
      handler: 'health.ready',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/health/live',
      handler: 'health.live',
      config: {
        auth: false,
      },
    },
  ],
};
