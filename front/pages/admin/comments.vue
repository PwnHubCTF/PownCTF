<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.comments.getAll">
        <template v-slot:userId="{item}">
          <NuxtLink :to="`/admin/user/${item.userId}`">{{ item.userId }}</NuxtLink>
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
        {name: "Challenge", value: "challengeId"},
        {name: "Data", value: "data"},
        {name: "Type", value: "type"},
      ]
    };
  },
};
</script>
