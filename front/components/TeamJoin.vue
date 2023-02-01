<template>
  <div class="">
    <p>You need a team</p>

<p @click="createMode = !createMode" class="cursor-pointer">
  Create a team ? {{ createMode }}
</p>

<form @submit.prevent="createTeam" v-if="createMode">
  <h1>Create</h1>
  <InputText type="text" v-model="team.name" label="Nom de l'équipe" />
  <InputText type="text" v-model="team.password" label="Mot de passe" />
  <Button type="submit">Submit</Button>
</form>

<form @submit.prevent="joinTeam" v-else>
  <h1>Join</h1>
  <InputText type="text" v-model="team.name" label="Nom de l'équipe" />
  <InputText type="text" v-model="team.password" label="Mot de passe" />
  <Button type="submit">Submit</Button>
</form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      createMode: false,
      team: {
        name: "",
        password: "",
      },
    };
  },
  async fetch() {
    const user = await this.$api.auth.getMe();
    this.user = user;
  },
  async mounted() {
    let joinTeam = this.$route.query["join"];
    if (joinTeam) {
      try {
        await this.$api.teams.directJoin(joinTeam);
        await this.$auth.fetchUser();
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    }
  },
  methods: {
    async joinTeam() {
      try {
        await this.$api.teams.join(this.team.name, this.team.password);
        await this.$auth.fetchUser();
        this.$toast.success("You joined a team");
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    },
    async createTeam() {
      try {
        await this.$api.teams.create(this.team.name, this.team.password);
        await this.$auth.fetchUser();
        this.$toast.success("Team has been created");
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    },
  },
};
</script>