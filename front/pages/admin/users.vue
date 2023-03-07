<template>
  <div class="p-8">
    <div v-if="$store.state.ctfOptions.categoryMode">
      <div class="font-medium text-xl">Player categories Filters</div>
      <p
        class="cursor-pointer rounded p-1"
        :class="{ 'bg-gray-200': playerCategory == null }"
        @click="playerCategory = null"
      >
        All
      </p>
      <div class="flex-col">
        <p
          class="cursor-pointer rounded p-1"
          :class="{ 'bg-gray-200': playerCategory == cat }"
          @click="playerCategory = cat"
          v-for="cat of playerCategories"
          :key="cat.id"
        >
          {{ cat.name }}
        </p>
      </div>
    </div>
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.users.getAdmin" :filters="filters">
        <template v-slot:pseudo="{ item }">
          <NuxtLink :to="`/user/${item.id}`">{{ item.pseudo }}</NuxtLink>
        </template>
        <template v-slot:role="{ item }">
          <p v-if="item.role == 1">Player</p>
          <p class="text-blue-500" v-if="item.role == 2">Manager</p>
          <p class="text-red-600" v-if="item.role == 3">Admin</p>
        </template>
        <template v-slot:action="{ item }">
          <Button
            v-if="$auth.user.role == 3 && item.role == 1"
            class="bg-orange-500"
            @clicked="changeRole(item, item.role + 1)"
            >Promote</Button
          ><Button
            v-if="$auth.user.role == 3 && item.role == 2"
            @clicked="changeRole(item, item.role - 1)"
            >Demote</Button
          >
        </template>
      </TablePaginate>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      playerCategory: null,
      playerCategories: [],
      headers: [
        { name: "Pseudo", value: "pseudo" },
        { name: "Email", value: "email" },
        { name: "Role", value: "role" },
        { name: "Action", value: "action" },
      ],
    };
  },
  async fetch(){
    if (this.$store.state.ctfOptions.categoryMode)
      this.playerCategories = await this.$api.categories.getAll();
  },
  computed: {
    filters(){
      return {
        category: this.playerCategory?.id
      }
    }
  },
  methods: {
    async changeRole(user, role) {
      try {
        await this.$api.users.changeRole(user.id, role);
        user.role = role;
        this.$toast.success("User role changed");
      } catch (error) {
        this.$toast.error("Impossible to change this user rank");
      }
    },
  },
};
</script>
