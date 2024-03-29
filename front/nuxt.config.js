export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "PwnHUB Platform",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      {
        rel: "icon",
        sizes: "any",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: "/api/theme.css",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/css/main"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~plugins/api.js",
    "~plugins/axios.js",
    "~plugins/filters.js",
    "~plugins/tooltip.js",
    { src: "~plugins/directives.js", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/auth-next",
    "vue-toastification/nuxt",
    "@nuxtjs/markdownit",
    "nuxt-basic-auth-module",
    "nuxt-vuex-localstorage",
    "nuxt-socket-io",
  ],
  basic: {
    name: process.env.BASIC_USER || "user",
    pass: process.env.BASIC_PASSWORD || "pass",
    enabled: process.env.BASIC_ENABLED
      ? process.env.BASIC_ENABLED === "true"
      : false,
  },
  io: {
    // module options
    sockets: [
      {
        name: "main",
        vuex: {
          mutations: [
            "flag --> challenges/USER_SOLVE",
            "deploy --> challenges/DEPLOY",
            "comment --> challenges/ADD_COMMENT",
            "message --> challenges/GET_MESSAGE",
          ],
        },
      },
    ],
  },
  proxy: {
    // With options
    "/api/": {
      target: `http://${process.env.API_URL || "localhost"}:3001`,
      pathRewrite: { "^/api/": "" },
    },
    "/ws/": {
      target: `ws://${process.env.API_URL || "localhost"}:3001`,
      ws: true,
      pathRewrite: { "^/ws/": "" },
    },
  },
  auth: {
    redirect: {
      login: "/",
      logout: "/",
      callback: "/",
      home: null,
    },
    strategies: {
      local: {
        token: {
          property: "access_token",
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: "/auth/login", method: "post" },
          logout: { url: "/auth/logout", method: "post" },
          user: { url: "/auth/me", method: "get" },
        },
      },
    },
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "/",
  },
  loading: "~/components/Loading.vue",
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: "/api",
    },
  },
  toast: {
    position: "bottom-center",
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: `http://${process.env.API_URL || "localhost"}:3001/`,
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
