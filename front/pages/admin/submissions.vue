<template>
  <div class="p-8">
    <ButtonDump class="mb-4" :route="$api.submissions.dump"/>
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.submissions.getAll">
        <template v-slot:userId="{item}">
          <NuxtLink :to="`/admin/user/${item.userId}`">{{ item.userId }} ({{ item.user.pseudo }})</NuxtLink>
        </template> 
        <template  v-slot:flag="{item}">
           <p class="rounded-sm py-1" :class="[item.isValid ? 'bg-green-600' : 'bg-red-300']">{{item.flag}}</p>
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
        {name: "User", value: "userId"},
        {name: "Challenge", value: "challengeId"},
        {name: "At", value: "creation"},
        {name: "Flag", value: "flag"},
      ]
    };
  },
};
</script>
