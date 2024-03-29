<template>
  <div class="text-center py-8 px-28">
    <p class="text-2xl">Create or join a team</p>

    <InputText
      class="my-2"
      type="text"
      v-model="team.name"
      label="Nom de l'équipe"
    />
    <InputText
      class="my-2"
      type="text"
      v-model="team.password"
      label="Mot de passe"
    />
    <div class="flex justify-between mt-8">
      <Button
        :loading="loading"
        class="w-6/12 bg-green-600"
        @clicked="createTeam()"
        type="submit"
        >Create</Button
      >
      <Button
        :loading="loading"
        class="bg-orange-400 w-4/12"
        @clicked="joinTeam()"
        type="submit"
        >Join</Button
      >
    </div>

    <!-- List open teams -->
    <h2 class="mt-4 text-xl font-bold">Open teams</h2>
    <FreeTeams :loading="loading" @joinTeam="joinTeamName" />

    <Transition name="slide">
      <div
        v-if="joinPopup && joinInfos"
        class="mt-32 absolute top-0 inset-x-1/4 border rounded-lg bg-primary text-white p-8"
      >
        <p class="text-xl my-2">You received an invitation to join team</p>
        <p class="font-medium my-4 text-2xl">{{ joinInfos.name }}</p>
        <div class="flex justify-around mt-8">
          <Button
            class="w-1/3 bg-green-600"
            @clicked="directJoin()"
            type="submit"
            >Accept</Button
          >
          <Button class="w-1/3" @clicked="joinPopup = false" type="submit"
            >Refuse</Button
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0.5;
  scale: 0;
}
.slide-enter {
  opacity: 0.5;
  scale: 0;
}
</style>

<script>
export default {
  data() {
    return {
      team: {
        name: "",
        password: "",
      },
      freeTeams: [],
      loading: false,
      joinPopup: false,
      joinInfos: null,
    };
  },
  async fetch() {
    try {
      this.freeTeams = await this.$api.teams.free();
    } catch (error) {}
  },
  async mounted() {
    let joinTeam = this.$route.query["join"];
    if (joinTeam) {
      this.joinPopup = true;
      try {
        this.joinInfos = await this.$api.teams.directJoinInfos(joinTeam);
      } catch (error) {}
    }
  },
  methods: {
    async directJoin() {
      this.loading = true;
      try {
        await this.$api.teams.directJoin(this.joinInfos.secretHash);
        await this.$auth.fetchUser();
        this.$toast.success("You joined a team");
        this.$router.push("/profile");
      } catch (error) {}
      this.loading = false;
    },
    async joinTeam() {
      this.loading = true;
      try {
        if (this.team.name.length > 0 && this.team.password.length > 0) {
          await this.$api.teams.join(this.team.name, this.team.password);
          await this.$auth.fetchUser();
          this.$toast.success("You joined a team");
          this.$router.push("/profile");
        } else {
          this.$toast.error("Empty fields");
        }
      } catch (error) {}
      this.loading = false;
    },
    async joinTeamName(name) {
      this.loading = true;
      try {
        await this.$api.teams.join(name, "");
        await this.$auth.fetchUser();
        this.$toast.success("You joined a team");
        this.$router.push("/profile");
      } catch (error) {}
      this.loading = false;
    },
    async createTeam() {
      this.loading = true;
      try {
        if (this.team.name.length > 0 && this.team.password.length > 0) {
          await this.$api.teams.create(this.team.name, this.team.password);
          await this.$auth.fetchUser();
          this.$toast.success("Team has been created");
          this.$router.push("/profile");
        } else {
          this.$toast.error("Empty fields");
        }
      } catch (error) {}
      this.loading = false;
    },
  },
};
</script>
