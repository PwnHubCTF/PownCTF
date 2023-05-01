<template>
  <div class="text-center p-8" v-if="team">
    <h1 class="text-4xl font-medium my-8">
      <InputEdit
        label="Name"
        :value="team.name"
        @edited="(name) => edit({ name })"
      />
    </h1>
    <table class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr
          :class="[
            index % 2 == 0
              ? 'bg-primary text-white'
              : 'bg-gray-300 text-gray-900',
          ]"
          v-for="(player, index) of team.users"
          :key="index"
        >
          <td class="py-2">{{ index + 1 }}</td>
          <td>
            <NuxtLink :to="`/admin/user/${player.id}`">{{
              player.pseudo
            }}</NuxtLink>
          </td>
          <td>{{ player.points }}</td>
          <td><Button
            class="bg-red-500 w-24"
            @clicked="kickFromTeam(player.id)"
            v-tooltip="'Kick user from team'"
            >Kick</Button
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      team: null,
    };
  },
  async fetch() {
    await this.getData();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async getData() {
      this.team = await this.$api.teams.get(this.id);
      this.submissions = await this.$api.submissions.forTeam(this.id);
    },
    async edit(data) {
      try {
        await this.$api.teams.edit(this.id, data);
        this.$toast.success("Team edited");
        await this.getData();
      } catch (error) {
        if (error.response?.data.message)
          this.$toast.error(error.response.data.message);
        else this.$toast.error(error.message);
      }
    },
    async kickFromTeam(userId) {
      try {
        await this.$api.users.kickFromTeam(userId);
        this.$toast.success("User is not in this team anymore");
        await this.getData();
      } catch (error) {
        if (error.response?.data.message)
          return this.$toast.error(error.response.data.message);
        this.$toast.error(error.message);
      }
    },
  },
};
</script>
