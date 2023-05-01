<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <InputText
        class="text-black"
        type="text"
        v-model="msg"
        placeholder="Broadcast message to all connected users"
      />
      <Button @clicked="sendMessage" v-tooltip="'Send this message to every connected users'"> To everyone </Button>
      <table class="w-full text-sm text-left text-gray-800 mt-8">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">UserId</th>
            <th scope="col" class="py-3 px-6">Pseudo</th>
            <th scope="col" class="py-3 px-6">IP</th>
            <th scope="col" class="py-3 px-6"></th>
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
              <NuxtLink :to="`/admin/user/${user.userId}`">{{
                user.userId
              }}</NuxtLink>
            </td>
            <td class="py-4 px-6">
              <span>{{ user.pseudo }}</span>
            </td>
            <td class="py-4 px-6">
              <span>{{ user.ip }}</span>
            </td>
            <td>
              <Button v-tooltip="'Send message to this user only'" @clicked="toUser(user.userId)"> Send </Button>
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
      msg: "",
    };
  },
  async fetch() {
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      this.users = await this.$api.events.getAll();
    },
    async toUser(id) {
      try {
        await this.$api.events.messageToUser(id, this.msg);
        this.$toast.success("Message sended to user");
      } catch (error) {}
    },
    async sendMessage() {
      try {
        await this.$api.events.broadcast(this.msg);
        this.$toast.success("Message sended to everyone");
      } catch (error) {}
    },
  },
};
</script>
