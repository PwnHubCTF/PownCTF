<template>
  <TeamJoin v-if="!$auth.user.teamId" />
  <div v-else-if="team">
    <div class="px-8 pt-8">
      <span
        class="text-lg cursor-pointer my-8 italic"
        v-tooltip="'Copy'"
        @click="copyLink()"
      >
        Direct join link: {{ getDirectLink() }}
      </span>
      <p class="text-gray-400 text-xs italic">
        Note: anybody with this private link can join the team without a
        password
      </p>
      <div class="flex mt-12" v-if="
            team.leader.id != $auth.user.id &&
            $store.state.ctfOptions.state == 'waiting'
          ">
        Leave team
        <svg
          class="ml-16 bg-red-500 w-12 cursor-pointer text-white py-1 rounded-sm"
          
          @click="leaveMine()"
          v-tooltip="`Leave team`"
          fill="currentColor"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path
            d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
          />
        </svg>
      </div>
          <p
            v-if="$store.state.ctfOptions.state == 'waiting'"
            class="text-gray-400 text-xs italic my-2"
          >
            You'll not be able to leave the team after the beginning of the CTF
          </p>
      <div>
        <div class="flex items-center mt-8">
          <p v-if="team.open">
            Team is <span class="font-bold text-green-500">open</span>. Anyone
            can join without a password
          </p>
          <p v-else>
            Team is <span class="font-bold text-red-500">close</span>. A
            password is needed to join the team.
          </p>
          <Button
            v-if="team.leader.id == $auth.user.id"
            class="w-32 ml-16"
            :class="[team.open ? 'bg-red-500' : 'bg-green-500']"
            :loading="loading"
            @clicked="toggleOpen"
            >{{ !team.open ? "Open" : "Close" }}</Button
          >
        </div>
        <div v-if="team.leader.id == $auth.user.id">
          <h2 class="text-gray-500 italic">Manage players</h2>
          <div
            v-for="user of team.users"
            :key="user.id"
            class="flex w-full md:w-1/2 my-2"
          >
            <p>{{ user.pseudo }}</p>
            <svg
              class="ml-12 bg-red-500 w-12 cursor-pointer text-white py-1 rounded-sm"
              v-if="
                team.leader.id != user.id &&
                $store.state.ctfOptions.state == 'waiting'
              "
              @click="kickFromTeam(user.id)"
              v-tooltip="`Kick ${user.pseudo}`"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 512 512"
            >
              <path
                d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
              />
            </svg>
          </div>
          <p
            v-if="$store.state.ctfOptions.state == 'waiting'"
            class="text-gray-400 text-xs italic my-2"
          >
            You'll not be able to kick anyone after the beginning of the CTF
          </p>
        </div>
      </div>
    </div>
    <TeamView :teamId="team.id" />
  </div>
</template>

<script>
export default {
  middleware: ["directJoinRedirect", "readyCategory", "team"],
  data() {
    return {
      team: null,
      directLink: null,
      loading: false,
    };
  },
  async fetch() {
    this.team = await this.$api.teams.getMine();
  },
  methods: {
    async toggleOpen() {
      this.loading = true;
      await this.$api.teams.setOpen(!this.team.open);
      this.team = await this.$api.teams.getMine();
      this.loading = false;
    },
    getDirectLink() {
      if (process.client) {
        return `${location.protocol}//${location.host}/team?join=${this.team.secretHash}`;
      }
    },
    async kickFromTeam(id) {
      try {
        await this.$api.teams.kickPlayer(id);
        this.$toast.success("Player kicked");
        this.$fetch();
      } catch (error) {}
    },
    async copyLink() {
      await navigator.clipboard.writeText(this.getDirectLink());
      this.$toast.success("Link copied!");
    },
    async leaveMine(){
      try {
        await this.$api.teams.leaveMine();
        this.$toast.success("Team leaved");
        setTimeout(() => {
          location.reload()
        }, 250);
      } catch (error) {}
    }
  },
};
</script>
