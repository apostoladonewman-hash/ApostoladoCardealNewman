module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pending-contents/pending',
      handler: 'pending-content.findPending',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/pending-contents',
      handler: 'pending-content.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/pending-contents/:id/approve',
      handler: 'pending-content.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/pending-contents/:id/reject',
      handler: 'pending-content.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
