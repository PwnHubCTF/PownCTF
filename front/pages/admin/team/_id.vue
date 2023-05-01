<template>
  <div class="text-center p-8" v-if="team">
    <div class="flex justify-around">
      <InputEdit
        label="Name"
        :value="team.name"
        @edited="(name) => edit({ name })"
      />
      <h1 class="text-2xl">
        Team
        <span v-if="team.open" class="text-green-500">open</span>
        <span class="text-red-500" v-else>close</span>
      </h1>
    </div>
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
            <span v-if="player.id === team.leader.id">(leader)</span>
          </td>
          <td>{{ player.points }}</td>
          <td>
            <Button
              class="bg-red-500 w-24"
              @clicked="kickFromTeam(player.id)"
              v-tooltip="'Kick user from team'"
              >Kick</Button
            >
          </td>
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
      try {
        this.team = await this.$api.teams.getOneAdmin(this.id);
        this.submissions = await this.$api.submissions.forTeam(this.id);
      } catch (error) {}
    },
    async edit(data) {
      try {
        await this.$api.teams.edit(this.id, data);
        this.$toast.success("Team edited");
        await this.getData();
      } catch (error) {}
    },
    async kickFromTeam(userId) {
      try {
        await this.$api.users.kickFromTeam(userId);
        this.$toast.success("User is not in this team anymore");
        await this.getData();
      } catch (error) {}
    },
  },
};
</script>
