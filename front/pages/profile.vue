<template>
  <div>
    <UserView :id="$auth.user.id" />
  </div>
</template>

<script>
export default {
  middleware: "auth",
};
</script>
