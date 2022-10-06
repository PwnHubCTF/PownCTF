<template>
  <div class="bg-green-100 dark:bg-gray-800 w-52">
    <div class="py-4 px-3">
      <!-- Menu -->
      <ul>
        <li>
          <NuxtLink
            v-if="$auth.loggedIn"
            to="/profile"
            class="flex showLogout items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                <p class="">{{ $auth.user.pseudo | truncate(10) }}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="logout opacity-0 z-40 ml-2 w-6 h-6 text-red-500 transition duration-200 dark:text-red-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"
                  />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  async fetch() {},
};
</script>
