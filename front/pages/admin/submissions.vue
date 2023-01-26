<template>
  <div class="p-8">
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">User</th>
            <th scope="col" class="py-3 px-6">Challenge</th>
            <th scope="col" class="py-3 px-6">At</th>
            <th scope="col" class="py-3 px-6">Flag</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b bg-gray-300 border-gray-200"
            v-for="submission of submissions"
            :key="submission.id"
          >
            <td class="py-4 px-6">{{submission.userId}}</td>
            <td class="py-4 px-6">{{submission.challengeId}}</td>
            <td class="py-4 px-6">{{submission.creation}}</td>
            <td class="py-4 px-6">{{submission.flag}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      submissions: [],
    };
  },
  async fetch() {
    this.submissions = await this.$api.submissions.getAll();
  },
};
</script>
