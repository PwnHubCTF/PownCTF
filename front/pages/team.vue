<template>
  <TeamJoin v-if="!$auth.user.teamId" />
  <TeamView v-else />
</template>

<script>
export default {
  middleware: "team",
  
};
</script>
