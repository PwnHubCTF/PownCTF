<template>
  <div class="p-8" v-if="user">
    <!-- Infos -->

    <div v-if="$store.state.ctfOptions.teamMode && user.team?.id">
      <NuxtLink
        :to="`/team/${user.team.id}`"
        class="font-bold hover:text-gray-600"
      >
        In team {{ user.team.name }}
      </NuxtLink>
      <!-- Kick team -->
      <Button
        class="bg-red-500"
        @clicked="kickFromTeam()"
        v-tooltip="'Kick user from team'"
        >Kick</Button
      >
    </div>
    <!-- Validated challenges -->
    <div v-if="!challenges">
      User doesn't have a team - can't validate any challenges
    </div>
    <div v-else>
      <h1 class="text-2xl">Challenges</h1>
      <div v-for="challenge in challenges" :key="challenge.id" class="my-4">
        <p v-if="challenge.solved" class="text-green-400">
          {{ challenge.name }}
        </p>
        <p v-else class="flex items-center">
          <span>{{ challenge.name }}</span>
          <Button
            class="ml-8 w-20 bg-orange-400"
            @clicked="giveFlag(challenge.id)"
            >Give flag</Button
          >
        </p>
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
    async giveFlag(challengeId) {
      try {
        await this.$api.submissions.validate(
          challengeId,
          this.$route.params.id
        );
        this.$toast.success("Flag validate");
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
