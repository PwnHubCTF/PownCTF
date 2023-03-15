<template>
  <div class="p-8">
    <div v-if="$store.state.ctfOptions.categoryMode">
      <div class="font-medium text-xl">Categories</div>
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
    <InputText
      class="my-2"
      placeholder="Search by pseudo/email"
      v-model="search"
    />
    <div class="overflow-x-auto relative">
      <TablePaginate
        :headers="headers"
        :getRoute="$api.users.getAdmin"
        :filters="filters"
      >
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
            class="bg-orange-500 w-1/3"
            @clicked="changeRole(item, item.role + 1)"
            >Promote</Button
          ><Button
            v-if="$auth.user.role == 3 && item.role == 2"
            class="w-1/3"
            @clicked="changeRole(item, item.role - 1)"
            >Demote</Button
          >
          <Button
            v-if="item.spaceship"
            class="bg-red-500 w-8"
            @clicked="addSpaceship(item, !item.spaceship)"
            v-tooltip="'Remove 🚀'"
            >🚀</Button
          ><Button
            v-else
            class="bg-green-500 w-8"
            v-tooltip="'Add 🚀'"
            @clicked="addSpaceship(item, !item.spaceship)"
            >🚀</Button
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
      search: "",
      headers: [
        { name: "Pseudo", value: "pseudo" },
        { name: "Email", value: "email" },
        { name: "Role", value: "role" },
        { name: "Action", value: "action" },
      ],
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode)
      this.playerCategories = await this.$api.categories.getAll();
  },
  computed: {
    filters() {
      return {
        category: this.playerCategory?.id,
        search: this.search != "" ? this.search : null,
      };
    },
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
    async addSpaceship(user, spaceship) {
      try {
        await this.$api.users.spaceship(user.id, spaceship);
        user.spaceship = spaceship;
        if (spaceship) {
          this.$toast.success("🚀 Added");
        } else {
          this.$toast.error("🚀 Removed");
        }
      } catch (error) {
        this.$toast.error("Impossible to change this user rank");
      }
    },
  },
};
</script>
