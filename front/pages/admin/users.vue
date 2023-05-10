<template>
  <div class="p-8">
    <ButtonDump class="mb-4" :route="$api.users.dump" />
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
      @input="debounceInput"
    />
    <div class="overflow-x-auto relative">
      <TablePaginate
        ref="data"
        :headers="headers"
        :getRoute="$api.users.getAdmin"
        :filters="filters"
      >
        <template v-slot:pseudo="{ item }">
          <NuxtLink :to="`/admin/user/${item.id}`">{{ item.pseudo }}</NuxtLink>
        </template>
        <template v-slot:role="{ item }">
          <p v-if="item.role == 1">Player</p>
          <p class="text-blue-500" v-if="item.role == 2">Manager</p>
          <p class="text-red-600" v-if="item.role == 3">Admin</p>
        </template>
        <template v-slot:action="{ item }">
          <div class="flex items-center gap-2">
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
            <!-- Remove -->
            <Button
              class="bg-red-500 w-16"
              @clicked="remove(item.id)"
              v-tooltip="'Delete user'"
              ><svg
                fill="currentColor"
                width="16"
                height="24"
                viewBox="0 0 448 512"
                class="text-white mx-auto"
              >
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                ></path>
              </svg>
            </Button>
          </div>
        </template>
      </TablePaginate>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";

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
    debounceInput: debounce(function (e) {
      this.search = e;
    }, 250),
    async changeRole(user, role) {
      try {
        await this.$api.users.changeRole(user.id, role);
        this.$toast.success("User role changed");
        await this.$refs.data.refresh();
      } catch (error) {}
    },
    async remove(id) {
      try {
        await this.$api.users.delete(id);
        this.$toast.success("user removed");
        await this.$refs.data.refresh();
      } catch (error) {}
    },
  },
};
</script>
