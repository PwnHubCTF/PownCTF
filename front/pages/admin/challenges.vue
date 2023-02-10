<template>
  <div class="p-8">
    <!-- Available challenges -->
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-800">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Name</th>
            <th scope="col" class="py-3 px-6">Category</th>
            <th scope="col" class="py-3 px-6">Source</th>
            <th scope="col" class="py-3 px-6">Access</th>
            <th scope="col" class="py-3 px-6">Files</th>
            <th scope="col" class="py-3 px-6">Dependencies</th>
            <th scope="col" class="py-3 px-6">Flag</th>
            <th scope="col" class="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b bg-gray-300 border-gray-200"
            v-for="challenge of challenges"
            :key="challenge.id"
          >
            <td class="py-4 px-6">
              <span class="flex items-center">
                {{ challenge.name }}
                <svg
                  v-if="challenge.instance"
                  class="ml-2 w-6 h-6 text-gray-500 400"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path
                    d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"
                  />
                </svg>
              </span>
            </td>
            <td class="py-4 px-6">{{ challenge.category }}</td>
            <td class="py-4 px-6"><a :href="challenge.githubUrl" v-if="challenge.source == 'github'" target="_blank" rel="noopener noreferrer">{{ challenge.source }}</a><span v-else>{{ challenge.source }}</span></td>
            <td class="py-4 px-6">
              <span v-if="challenge.instance == 'single'">
                <ButtonDeployer :challengeId="challenge.id" :admin="true" />
              </span>
              <span v-else>{{ challenge.challengeUrl }}</span>
              <span v-if="challenge.instance == 'multiple'"
                >Player deployed</span
              >
            </td>
            <td>
              <ul>
                <li v-for="file of challenge.files" :key="file.id">
                  <a target="_blank" :href="`/api/files/${file.id}`">{{
                    file.name
                  }}</a>
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="depended of challenge.depends_on" :key="depended.id">
                  {{ depended.name }}
                </li>
              </ul>
            </td>
            <td class="text-center">
              <p
                class="cursor-pointer"
                @click="copy(challenge.flag)"
                v-tooltip="challenge.flag"
              >
                Copy
              </p>
              <span v-if="challenge.signedFlag">(Signed)</span>
            </td>
            <td>
              <Button :loading="loading" @clicked="deleteChallenge(challenge)" class="w-16">
                <svg
                  fill="currentColor"
                  width="16"
                  height="16"
                  class="text-white mx-auto"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Update points -->
    <Button :loading="loading" @clicked="updateChallengesPoints" class="bg-orange-400 text-white">Update challenges points</Button>
    <!-- Challenges loader -->
    <div class="my-8">
      <AdminChallengesLoader @refresh="getChallenges()" />
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      challenges: [],
      loading: false,
    };
  },
  async fetch() {
    await this.getChallenges();
  },
  methods: {
    async getChallenges() {
      this.loading = true;
      this.challenges = await this.$api.challenges.getAll();
      this.loading = false;
    },
    async deleteChallenge(challenge) {
      this.loading = true;
      await this.$api.challenges.delete(challenge.id);
      await this.getChallenges();
      this.loading = false;
    },
    async copy(txt) {
      await navigator.clipboard.writeText(txt);
      this.$toast.success('Copied!')
    },
    async updateChallengesPoints(){
      this.loading = true;
      await this.$api.challenges.updateChallengesPoints();
      this.$toast.success('Points updated')
      this.loading = false;
    }
  },
};
</script>
