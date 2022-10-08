<template>
  <div class="bg-green-100 dark:bg-gray-800 w-52">
    <div class="py-4 px-3">
      <!-- Menu -->
      <ul>
        <li>
          <NuxtLink
            v-if="$auth.loggedIn && $auth.user.role === 3"
            to="/admin"
            class="flex justify-center showLogout mb-6 p-2 text-base font-normal rounded-lg text-red-700 hover:bg-red-200 bg-red-100 dark:bg-red-300 dark:hover:bg-red-400"
          >
            Admin
          </NuxtLink>
          <NuxtLink
            v-if="$auth.loggedIn"
            to="/profile"
            class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z"
              />
            </svg>
            <div class="ml-3">
              <div class="flex justify-between">
                <p class="">{{ $auth.user.pseudo | truncate(11) }}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="opacity-0 group-hover:opacity-100 z-40 ml-2 w-6 h-6 text-red-500 transition duration-200 dark:text-red-400"
                  fill="currentColor"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  @click="userLogout"
                >
                  <path
                    d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"
                  />
                </svg>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            v-if="$auth.loggedIn && teamMode === true"
            to="/team"
            class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z"
              />
            </svg>
            <div class="ml-3">Team</div>
          </NuxtLink>
          <NuxtLink
            v-if="!$auth.loggedIn"
            to="/login"
            class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            v-if="!$auth.loggedIn"
            to="/register"
            class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <span class="ml-3">Register</span>
          </NuxtLink>
          <NuxtLink
            to="/scoreboard"
            class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <div class="pt-11" v-if="$auth.loggedIn && state !== 'waiting'">
        <span class="text-gray-400 text-center">Categories</span>
        <ul>
          <li v-for="category in categories" :key="category.name">
            <NuxtLink
              :to="category.goto"
              @click="(e) => e.target.scrollIntoView()"
              class="group flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                aria-hidden="true"
                class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                v-html="category.path"
              ></svg>
              <span class="ml-3">{{ category.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      teamMode: false,
      state: "waiting",
    };
  },
  async fetch() {
    this.teamMode = await this.$api.config.getTeamMode();
    this.state = await this.$api.config.getCtfState();
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
        this.$toast.error("Cannot logout.. IMPOSSIBLE");
      }
    },
    getSvgFromCategory(category) {
      switch (category) {
        case "web":
          return `
          <path d="M12.02 0c6.614.011 11.98 5.383 11.98 12 0 6.623-5.376 12-12 12-6.623 0-12-5.377-12-12 0-6.617 5.367-11.989 11.981-12h.039zm3.694 16h-7.427c.639 4.266 2.242 7 3.713 7 1.472 0 3.075-2.734 3.714-7m6.535 0h-5.523c-.426 2.985-1.321 5.402-2.485 6.771 3.669-.76 6.671-3.35 8.008-6.771m-14.974 0h-5.524c1.338 3.421 4.34 6.011 8.009 6.771-1.164-1.369-2.059-3.786-2.485-6.771m-.123-7h-5.736c-.331 1.166-.741 3.389 0 6h5.736c-.188-1.814-.215-3.925 0-6m8.691 0h-7.685c-.195 1.8-.225 3.927 0 6h7.685c.196-1.811.224-3.93 0-6m6.742 0h-5.736c.062.592.308 3.019 0 6h5.736c.741-2.612.331-4.835 0-6m-12.825-7.771c-3.669.76-6.671 3.35-8.009 6.771h5.524c.426-2.985 1.321-5.403 2.485-6.771m5.954 6.771c-.639-4.266-2.242-7-3.714-7-1.471 0-3.074 2.734-3.713 7h7.427zm-1.473-6.771c1.164 1.368 2.059 3.786 2.485 6.771h5.523c-1.337-3.421-4.339-6.011-8.008-6.771"/>`;
        case "forensic":
          return `
          <path d="M18.516 18.448c1.648 1.946-1.365 3.802-2.292 1.451-.425-1.081-1.438-3.76-1.69-4.434-.313-.833.499-1.25 1.012-.557.34.459 2.263 2.706 2.97 3.54zm3.484-18.448v24h-20v-24h20zm-2 2h-16v20h1v-1.5c0-.276.224-.5.5-.5s.5.224.5.5v1.5h1v-1.5c0-.276.224-.5.5-.5s.5.224.5.5v1.5h1v-1.5c0-.276.224-.5.5-.5s.5.224.5.5v1.5h10v-20zm-8 7c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1zm0-6c3.866 0 7 3.134 7 7 0 1.956-.804 3.723-2.098 4.993-.262-.314-.47-.569-.554-.682-.354-.478-.861-.753-1.391-.753-.485 0-.939.237-1.215.635-.311.449-.364 1.041-.145 1.623l.341.906c-.616.177-1.265.278-1.938.278-3.866 0-7-3.134-7-7s3.134-7 7-7zm-2.5 2.836c.656-.396 1.374-.605 2.091-.65l.12-.777c-.893.028-1.79.276-2.609.771-.818.492-1.455 1.171-1.897 1.947l.744.257c.374-.613.893-1.15 1.551-1.548zm.794 1.318c.334-.201.692-.324 1.056-.387l.121-.792c-.54.057-1.077.22-1.575.521-.496.3-.89.698-1.193 1.149l.756.264c.226-.293.501-.553.835-.755zm3.706 2.846c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2z"/>            `;
        case "stegano":
          return `
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            `;
        case "crypto":
          return `
          <path d="M16 1c-4.418 0-8 3.582-8 8 0 .585.063 1.155.182 1.704l-8.182 7.296v5h6v-2h2v-2h2l3.066-2.556c.909.359 1.898.556 2.934.556 4.418 0 8-3.582 8-8s-3.582-8-8-8zm-6.362 17l3.244-2.703c.417.164 1.513.703 3.118.703 3.859 0 7-3.14 7-7s-3.141-7-7-7c-3.86 0-7 3.14-7 7 0 .853.139 1.398.283 2.062l-8.283 7.386v3.552h4v-2h2v-2h2.638zm.168-4l-.667-.745-7.139 6.402v1.343l7.806-7zm10.194-7c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm-1 0c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z"/>
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
          <path d="M23 10.826v2.349c-1.562 0-3 1.312-3 2.857 0 2.181 1.281 5.968-6 5.968v-2.002c4.917 0 3.966-1.6 3.966-3.967 0-2.094 1.211-3.5 2.278-4.031-1.067-.531-2.278-1.438-2.278-3.312 0-2.372.94-4.692-3.966-4.686v-2.002c7.285 0 6 4.506 6 6.688 0 1.544 1.438 2.138 3 2.138zm-19-2.138c0-2.182-1.285-6.688 6-6.688v2.002c-4.906-.007-3.966 2.313-3.966 4.686 0 1.875-1.211 2.781-2.278 3.312 1.067.531 2.278 1.938 2.278 4.031 0 2.367-.951 3.967 3.966 3.967v2.002c-7.281 0-6-3.787-6-5.969 0-1.545-1.438-2.857-3-2.857v-2.349c1.562.001 3-.593 3-2.137zm9 5.312v1.278c0 1.143-.722 2.068-1.774 2.276l-.199-.431c.487-.184.797-.773.797-1.216h-.824v-1.907h2zm0-6h-2v2h2v-2z"/>            `;
      }
    },
  },
  created() {
    let categories = this.getCategories();
    this.categories = categories.map((c) => {
      return {
        name: c.charAt(0).toUpperCase() + c.slice(1),
        goto: "/challenges#" + c,
        path: this.getSvgFromCategory(c),
      };
    });
  },
};
</script>
