<template>
  <div class="p-8">
    <div v-if="!error" class="overflow-x-auto relative">
      <h2>Ressources</h2>
      {{ ressources }}
      <h2>Global instances</h2>
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Challenge id</th>
            <th scope="col" class="py-3 px-6">URL</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-200"
            :class="[index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300']"
            v-for="(instance, index) in single"
            :key="index"
          >
            <td class="py-4 px-6">{{ instance.challengeId }}</td>
            <td v-if="instance.url" class="py-4 px-6">
              <a target="_blank" :href="`${instance.url}`">{{
                instance.url
              }}</a>
            </td>
            <td v-else class="py-4 px-6">{{ instance.progress }}</td>
          </tr>
        </tbody>
      </table>
      <h2>Users deployed</h2>
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Owner</th>
            <th scope="col" class="py-3 px-6">Challenge id</th>
            <th scope="col" class="py-3 px-6">URL</th>
            <th scope="col" class="py-3 px-6">Time left</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-200"
            :class="[index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300']"
            v-for="(instance, index) in multiple"
            :key="index"
          >
            <td class="py-4 px-6">
              <a
                :href="`/${
                  $store.state.ctfOptions.teamMode ? 'team' : 'user'
                }/${instance.owner}`"
                >{{ instance.owner }}</a
              >
            </td>
            <td class="py-4 px-6">{{ instance.challengeId }}</td>
            <td v-if="instance.serverUrl" class="py-4 px-6">
              {{ instance.serverUrl }}:{{ instance.port }}
            </td>
            <td v-else class="py-4 px-6">{{ instance.progress }}</td>
            <td class="py-4 px-6"><Countdown :end="instance.destroyAt" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Deployer seems to be down</p>
      <p class="text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      single: [],
      multiple: [],
      error: null,
      ressources: null,
    };
  },
  async mounted() {
    try {
      const instances = await this.$api.challenges.instances();
      this.ressources = await this.$api.challenges.ressources();
      this.single = instances.single;
      this.multiple = instances.multiple;
    } catch (error) {
      if (error.response?.data.message)
        return (this.error = error.response.data.message);
      this.error = error.message;
    }
  },
};
</script>
