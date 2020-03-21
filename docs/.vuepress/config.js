const sidebars = {
  guide: [
    {
      title: 'Guide',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/setup',
        '/guide/usage',
        '/guide/options',
        '/guide/sponsors'
      ]
    },
  ],

  api: [
    {
      title: 'API',
      collapsable: false,
      children: [
        '/api/model',
        '/api/query'
      ]
    }
  ]
}

module.exports = {
  title: 'Vuex ORM Soft Delete',
  description: 'Vuex ORM plugin for adding soft delete feature to model entities.',

  base: '/plugin-soft-delete/',

  themeConfig: {
    repo: 'vuex-orm/plugin-soft-delete',
    docsDir: 'docs',

    nav: [
      {
        text: 'Guide',
        link: '/guide/installation'
      },
      {
        text: 'API Reference',
        link: '/api/model'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/vuex-orm/plugin-soft-delete/releases'
      }
    ],

    sidebar: {
      '/guide/': sidebars.guide,
      '/api/': sidebars.api,
      '/': sidebars.guide
    }
  }
}
