<template>
  <div class="p-8">
    <!-- Available challenges -->
    <div class="overflow-x-auto relative">
      <h1>Available challenges</h1>
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Name</th>
            <th scope="col" class="py-3 px-6">Category</th>
            <th scope="col" class="py-3 px-6">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b bg-gray-300 border-gray-200"
            v-for="challenge of challenges"
            :key="challenge.id"
          >
            <td class="py-4 px-6">{{ challenge.name }}</td>
            <td class="py-4 px-6">{{ challenge.category }}</td>
            <td class="py-4 px-6">{{ challenge.source }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Challenges loader -->
    <div class="my-8">
      Load challenge from github
      <AdminChallengesLoader 
      @refresh="getChallenges()" />
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      challenges: [],
    };
  },
  async fetch() {
    await this.getChallenges()
  },
  methods: {
    async getChallenges() {
      this.challenges = await this.$api.challenges.getAll();
    },
  }
};
</script>
