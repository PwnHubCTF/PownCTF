<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <TablePaginate :headers="headers" :getRoute="$api.teams.free">
        <template v-slot:name="{ item }">
          <NuxtLink :to="`/team/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
        <template v-slot:players="{ item }">
          {{ item.players }} / {{ $store.state.ctfOptions.maxPlayersPerTeam }}
        </template>
        <template v-slot:action="{ item }">
          <Button
            :loading="loading"
            class="bg-orange-400"
            @clicked="$emit('joinTeam', item.name)"
            type="submit"
            >Join</Button
          >
        </template>
      </TablePaginate>
    </div>
  </div>
</template>

<script>
export default {
  props: ["loading"],
  data() {
    return {
      headers: [
        { name: "Name", value: "name" },
        { name: "Players", value: "players" },
        { name: "", value: "action" },
      ],
    };
  },
};
</script>
