<template>
  <div class="bg-green-100 dark:bg-gray-800 w-64">
    <div v-if="$auth.loggedIn">
      {{$auth.user.pseudo}}
      <a @click="userLogout">logout</a>
    </div>
    <div class="py-4 px-3">
      <!-- Menu -->
      <ul>
        <li>
          <NuxtLink
            v-if="!$auth.loggedIn"
            to="/login"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
            <span class="ml-3">Login</span>
          </NuxtLink>
          <NuxtLink
            to="/scoreboard"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
            <span class="ml-3">Scoreboard</span>
          </NuxtLink>
        </li>
      </ul>
      <!-- Categories List -->
      <br class="pt-11" />
      <span class="text-gray-400 text-center">Categories</span>
      <ul>
        <li v-for="category in categories" :key="category.name">
          <NuxtLink
            :to="category.goto"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              v-html="category.path"
            ></svg>
            <span class="ml-3">{{ category.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
    };
  },
  methods: {
    getCategories() {
      // API
      return [
        "web",
        "forensic",
        "stegano",
        "crypto",
        "reverse",
        "pwn",
        "misc",
        "prog",
      ];
    },
    async userLogout() {
      try {
        await this.$auth.logout();
      } catch (err) {
        console.log(err);
      }
    },
    getSvgFromCategory(category) {
      switch (category) {
        case "web":
          return `
            <g id="network"/><g id="connection"/><g id="page"><g><path d="M92,4H32c-2.2,0-4,1.8-4,4v4h-4c-2.2,0-4,1.8-4,4v4h-4c-2.2,0-4,1.8-4,4v4H8c-2.2,0-4,1.8-4,4v60c0,2.2,1.8,4,4,4h60    c2.2,0,4-1.8,4-4v-4h4c2.2,0,4-1.8,4-4v-4h4c2.2,0,4-1.8,4-4v-4h4c2.2,0,4-1.8,4-4V8C96,5.8,94.2,4,92,4z M30,8c0-1.1,0.9-2,2-2    h60c1.1,0,2,0.9,2,2v6h-6.6c-0.7-1.2-2-2-3.4-2h-1h-6H30V8z M22,16c0-1.1,0.9-2,2-2h60c1.1,0,2,0.9,2,2v6h-6.6c-0.7-1.2-2-2-3.4-2    h-1h-6H22V16z M14,24c0-1.1,0.9-2,2-2h60c1.1,0,2,0.9,2,2v6h-6.6c-0.7-1.2-2-2-3.4-2h-1h-6H14V24z M8,30h60c1.1,0,2,0.9,2,2v6H6    v-6C6,30.9,6.9,30,8,30z M70,92c0,1.1-0.9,2-2,2H8c-1.1,0-2-0.9-2-2V40h64V92z M78,84c0,1.1-0.9,2-2,2h-4V32h6V84z M86,76    c0,1.1-0.9,2-2,2h-4V24h6V76z M92,70h-4V16h6v52C94,69.1,93.1,70,92,70z"/><circle cx="53" cy="34" r="2"/><circle cx="59" cy="34" r="2"/><circle cx="65" cy="34" r="2"/><circle cx="61" cy="26" r="2"/><circle cx="67" cy="26" r="2"/><circle cx="73" cy="26" r="2"/><circle cx="69" cy="18" r="2"/><circle cx="75" cy="18" r="2"/><circle cx="81" cy="18" r="2"/><circle cx="77" cy="10" r="2"/><circle cx="83" cy="10" r="2"/><circle cx="89" cy="10" r="2"/><path d="M12,55h52c1.7,0,3-1.3,3-3v-6c0-1.7-1.3-3-3-3H12c-1.7,0-3,1.3-3,3v6C9,53.7,10.3,55,12,55z M11,46c0-0.6,0.4-1,1-1h52    c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1H12c-0.6,0-1-0.4-1-1V46z"/><path d="M36,69H12c-1.7,0-3,1.3-3,3v16c0,1.7,1.3,3,3,3h24c1.7,0,3-1.3,3-3V72C39,70.3,37.7,69,36,69z M37,88c0,0.6-0.4,1-1,1H12    c-0.6,0-1-0.4-1-1V72c0-0.6,0.4-1,1-1h24c0.6,0,1,0.4,1,1V88z"/><path d="M67,64H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h56c0.6,0,1-0.4,1-1S67.6,64,67,64z"/><path d="M67,59H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h56c0.6,0,1-0.4,1-1S67.6,59,67,59z"/><path d="M66,69H43c-0.6,0-1,0.4-1,1s0.4,1,1,1h23c0.6,0,1-0.4,1-1S66.6,69,66,69z"/><path d="M66,74H43c-0.6,0-1,0.4-1,1s0.4,1,1,1h23c0.6,0,1-0.4,1-1S66.6,74,66,74z"/><path d="M66,79H43c-0.6,0-1,0.4-1,1s0.4,1,1,1h23c0.6,0,1-0.4,1-1S66.6,79,66,79z"/><path d="M66,84H43c-0.6,0-1,0.4-1,1s0.4,1,1,1h23c0.6,0,1-0.4,1-1S66.6,84,66,84z"/><path d="M66,89H43c-0.6,0-1,0.4-1,1s0.4,1,1,1h23c0.6,0,1-0.4,1-1S66.6,89,66,89z"/></g></g><g id="support"/><g id="configuration"/><g id="cloud_storage"/><g id="password"/><g id="search_engine"/><g id="history"/><g id="SEO"/><g id="optimization"/><g id="backlink"/><g id="performance"/><g id="analytics"/><g id="security"/><g id="dark_web"/><g id="video_player"/><g id="upload_download"/><g id="incognito_tab"/><g id="bookmark"/>
            `;
        case "forensic":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "stegano":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "crypto":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "misc":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "reverse":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "pwn":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "prog":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
      }
    },
  },
  created() {
    let categories = this.getCategories();
    this.categories = categories.map((c) => {
      return {
        name: c.charAt(0).toUpperCase() + c.slice(1),
        goto: "/challenges/#" + c,
        path: this.getSvgFromCategory(c),
      };
    });
  }
};
</script>
