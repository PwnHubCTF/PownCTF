<template>
  <div>
    <div>Profile</div>
    {{ $auth.user }}
  </div>
</template>

<script>
export default {
  middleware: "auth",
};
</script>
