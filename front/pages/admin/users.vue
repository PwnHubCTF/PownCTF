<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.users.getAdmin">
        <template v-slot:pseudo="{item}">
          <NuxtLink :to="`/user/${item.id}`">{{ item.pseudo }}</NuxtLink>
        </template> 
        <template v-slot:role="{item}">
              <p v-if="item.role == 1">Player</p>
              <p class="text-blue-500" v-if="item.role == 2">Manager</p>
              <p class="text-red-600" v-if="item.role == 3">Admin</p>
        </template> 
        <template v-slot:action="{item}">
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
      headers: [
        {name: "Pseudo", value: "pseudo"},
        {name: "Email", value: "email"},
        {name: "Role", value: "role"},
        {name: "Action", value: "action"},
      ]
    };
  },
  methods: {
    async changeRole(user, role) {
      try {
        await this.$api.users.changeRole(user.id, role);
        user.role = role
        this.$toast.success("User role changed");
      } catch (error) {
        this.$toast.error("Impossible to change this user rank");
      }
    },
  },
};
</script>
