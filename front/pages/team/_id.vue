<template>
  <div>
    <div v-if="!$auth.loggedIn" class="text-center">
      <!-- Name of the CTF -->
      <NuxtLink
        to="/"
        class="text-6xl font-medium mt-8 cursor-pointer"
      >
        {{ $store.state.ctfOptions.eventName }}
      </NuxtLink>
    </div>
    <TeamView :teamId="$route.params.id" />
  </div>
</template>

<script>
export default {};
</script>
