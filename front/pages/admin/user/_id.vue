<template>
  <div class="p-8" v-if="user">
    <h1 class="text-5xl mb-4 text-center">Player <span class="font-bold">{{user.pseudo}}</span></h1>
    <div class="flex">
      <!-- Validated challenges -->
    <div v-if="!challenges">
      User doesn't have a team - can't validate any challenges
    </div>
    <div v-else class="w-1/2 p-8 border rounded-sm">
      <table>
        <thead>
          <tr>
            <th>Challenges</th>
            <th>Solved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="challenge in challenges" :key="challenge.id">
            <td>{{ challenge.name }}</td>
            <td v-if="challenge.solved?.userId == id">
              <span class="mx-6">{{
                challenge.solved.creation | moment("DD/MM, h:mm:ss a")
              }}</span>
            </td>
            <td v-else></td>
            <td>
              <Button
                v-if="challenge.solved?.userId == id"
                class="ml-8 bg-green-400 w-12"
                v-tooltip="'Remove flag from player'"
                @clicked="removeFlag(challenge.id)"
                ><svg
                  aria-hidden="true"
                  fill="currentColor"
                  width="24"
                  height="24"
                  viewBox="0 0 448 512"
                  class="mx-auto"
                >
                  <path
                    d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"
                  ></path></svg
              ></Button>
              <Button
                v-else
                class="ml-8 bg-red-400 w-12"
                v-tooltip="'Give flag to player'"
                @clicked="giveFlag(challenge.id)"
                ><svg
                  aria-hidden="true"
                  fill="currentColor"
                  width="24"
                  height="24"
                  class="mx-auto"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"
                  ></path></svg
              ></Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Infos -->
    <div class="p-8 border rounded-sm w-1/2">
      <div
        class="flex items-center gap-16"
        v-if="$store.state.ctfOptions.teamMode && user.team?.id"
      >
        <NuxtLink :to="`/team/${user.team.id}`" class="hover:text-gray-600">
          <span class="text-gray-400 text-xl">Member of team: </span
          ><span class="text-4xl font-bold">{{ user.team.name }}</span>
        </NuxtLink>
        <!-- Kick team -->
        <Button
          class="bg-red-500 w-24"
          @clicked="kickFromTeam()"
          v-tooltip="'Kick user from team'"
          >Kick</Button
        >
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      user: null,
      challenges: null,
    };
  },
  async fetch() {
    await this.getUser();
    await this.getChallenges();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async getUser() {
      try {
        this.user = await this.$api.users.getOne(this.$route.params.id);
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
    async kickFromTeam() {
      try {
        await this.$api.users.kickFromTeam(this.$route.params.id);
        this.user.team = null;
        this.$toast.success("User is not in a team anymore");
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
    async getChallenges() {
      try {
        this.challenges = await this.$api.challenges.adminGetMine(
          this.$route.params.id
        );
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
    async removeFlag(challengeId) {
      try {
        await this.$api.submissions.remove(challengeId, this.$route.params.id);
        this.$toast.success("Flag removed");
        await this.getChallenges();
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
    async giveFlag(challengeId) {
      try {
        await this.$api.submissions.validate(
          challengeId,
          this.$route.params.id
        );
        this.$toast.success("Flag validated");
        await this.getChallenges();
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
  },
};
</script>
