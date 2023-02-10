<template>
  <TeamView :teamId="$route.params.id"/>
</template>

<script>
export default {
  middleware: "team"
};
</script>
