<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">User</th>
            <th scope="col" class="py-3 px-6">Email</th>
            <th scope="col" class="py-3 px-6">Role</th>
            <th scope="col" class="py-3 px-6">Action</th>
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
              <NuxtLink :to="`/user/${user.id}`">{{ user.pseudo }}</NuxtLink>
            </td>
            <td class="py-4 px-6">{{ user.email }}</td>
            <td class="py-4 px-6">
              <p v-if="user.role == 1">Player</p>
              <p class="text-blue-500" v-if="user.role == 2">Manager</p>
              <p class="text-red-600" v-if="user.role == 3">Admin</p>
            </td>
            <td class="py-4 px-6 flex">
              <Button
                v-if="$auth.user.role == 3 && user.role == 1"
                class="bg-orange-500"
                @clicked="changeRole(user.id, user.role + 1)"
                >Promote</Button
              ><Button
                v-if="$auth.user.role == 3 && user.role == 2"
                @clicked="changeRole(user.id, user.role - 1)"
                >Demote</Button
              >
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination
        :current="current"
        :total="total"
        :per-page="perPage"
        @page-changed="current = $event"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      users: [],
      current: 1,
      perPage: 10,
      total: 0,
    };
  },
  async fetch() {
    await this.getUsers();
  },
  watch: {
    async current() {
      await this.getUsers();
    },
  },
  methods: {
    async changeRole(userId, role) {
      try {
        await this.$api.users.changeRole(userId, role);
        this.$toast.success("User role changed");
        await this.getUsers();
      } catch (error) {
        this.$toast.error("Impossible to change this user rank");
      }
    },
    async getUsers() {
      const res = await this.$api.users.getAdmin(this.perPage, this.current-1);
      this.users = res.data
      this.total = res.count
    },
  },
};
</script>
