<template>
  <TablePaginate
    :headers="headers"
    :getRoute="$api.submissions.forChallenge(challenge.id)"
  >
    <template v-slot:pseudo="{ item }">
      <NuxtLink
        v-if="$store.state.ctfOptions.teamMode"
        :to="`/team/${item.id}`"
        >{{ item.pseudo }}</NuxtLink
      >
      <NuxtLink v-else :to="`/user/${item.id}`">{{ item.pseudo }}</NuxtLink>
    </template>
    <template v-slot:creation="{ item }">
      {{ item.creation | fromNow }}
    </template>
  </TablePaginate>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      headers: [
        {
          name: this.$store.state.ctfOptions.teamMode ? "Team" : "Pseudo",
          value: "pseudo",
        },
        { name: "At", value: "creation" },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
