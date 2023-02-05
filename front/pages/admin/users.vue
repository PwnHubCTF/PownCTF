<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">User</th>
            <th scope="col" class="py-3 px-6">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-200"
            :class="[index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300']"
            v-for="(user, index) in users"
            :key="index"
          >
            <td class="py-4 px-6"><a :href="`/user/${user.id}`">{{ user.pseudo }}</a></td>
            <td class="py-4 px-6">{{ user.email }}</td>
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
  async mounted() {
    this.users = await this.$api.users.getAdmin();
  },
};
</script>
