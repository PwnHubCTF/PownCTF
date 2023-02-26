<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.challenges.getXss">
        <template v-slot:userId="{ item }">
          <NuxtLink :to="`/user/${item.userId}`">{{ item.userId }}</NuxtLink>
        </template>
        <template v-slot:payload="{ item }">
          <p class="break-all">{{ item.payload }}</p>
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
        { name: "Challenge", value: "challengeId" },
        { name: "User", value: "userId" },
        { name: "Payload", value: "payload" },
      ],
    };
  },
};
</script>
