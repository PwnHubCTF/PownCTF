<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">UserId</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-200"
            :class="[index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300']"
            v-for="(user, index) in users"
            :key="index"
          >
            <td class="py-4 px-6">
              <NuxtLink :to="`/user/${user.userId}`">{{ user.userId }}</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      users: [],
    };
  },
  async fetch() {
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      this.users = await this.$api.events.getAll();
    },
  },
};
</script>
