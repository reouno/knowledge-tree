import logger from 'connect-logger'
import colors from 'vuetify/es5/util/colors'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  ssr: true, // default
  target: 'server', // default
  dev: isDev,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'My-space',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/style/main.css' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    { src: '~/plugins/infinite-loading', ssr: false },
    { src: '~/plugins/vuex-persist', ssr: false },
  ],

  serverMiddleware: [logger({ format: '%date %status %method %url (%time)' })],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-healthcheck',
  ],

  auth: {
    localStorage: false,
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        secure: true,
      },
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/chat',
    },
    strategies: {
      cookie: {
        cookie: {
          // (optional) If set, we check this cookie existence for loggedIn check
          // name: 'XSRF-TOKEN',
        },
        user: {
          property: '',
        },
        endpoints: {
          // (optional) If set, we send a get request to this endpoint before login
          csrf: {
            url: '/api/accounts/set_csrf/',
            method: 'get',
          },
          login: {
            url: '/api/auth/login/',
            method: 'post',
          },
          logout: {
            url: '/api/auth/logout/',
            method: 'post',
          },
          user: {
            url: '/api/accounts/me/',
            method: 'get',
          },
        },
      },
    },
  },

  router: {
    middleware: ['auth'],
    extendRoutes(routes) {
      routes.push({ path: '/', redirect: '/chat' })
    },
  },

  proxy: isDev
    ? {
        '/api': {
          target: 'http://localhost:8000',
        },
      }
    : {},

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: isDev
    ? {
        proxy: true,
        prefix: '',
        credentials: true,
      }
    : {
        baseURL: process.env.NUXT_ENV_BASE_URL,
        credentials: true,
      },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  healthcheck: {
    path: '/front-health-check',
    contentType: 'application/json',
    healthy: () => {
      return JSON.stringify('Hi!')
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
