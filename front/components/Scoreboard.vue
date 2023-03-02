<template>
  <div class="p-0 md:p-2 lg:p-8">
    <div class="w-full md:w-3/4 lg:w-3/5 mx-auto">
      <client-only>
        <canvas ref="scoreboard"></canvas>
      </client-only>
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th v-if="$store.state.ctfOptions.teamMode">Team</th>
          <th v-else>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr
          :class="[
            index % 2 == 0
              ? 'bg-primary text-white'
              : 'bg-gray-300 text-gray-900',
          ]"
          v-for="(player, index) of users.data"
          :key="index"
        >
          <td class="py-2">{{ player.rank }}</td>
          <td v-if="$store.state.ctfOptions.teamMode">
            <NuxtLink :to="`/team/${player.id}`">{{ player.pseudo }}</NuxtLink>
          </td>
          <td v-else>
            <NuxtLink :to="`/user/${player.id}`">{{ player.pseudo }}</NuxtLink>
          </td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="paginate" class="flex justify-between w-full">
      <!-- Page count -->
      <div>{{ page + 1 }} / {{ Math.round(users.count / limit) }}</div>
      <!-- Next / Previous -->
      <div class="flex gap-4 mt-4">
        <div
          class="border-gray-600 border bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
          v-if="page > 0 && page * limit < users.count"
          @click="changePage(page - 1)"
        >
          &lt;
        </div>
        <div
          class="border-gray-600 border bg-gray-300 px-4 py-2 rounded-md cursor-default"
          v-else
        >
          &lt;
        </div>
        <div
          class="border-gray-600 border bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
          v-if="(page + 1) * limit < users.count"
          @click="changePage(page + 1)"
        >
          &gt;
        </div>
        <div
          class="border-gray-600 border bg-gray-300 px-4 py-2 rounded-md cursor-default"
          v-else
        >
          &gt;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-adapter-moment";

export default {
  props: {
    paginate: {
      type: Boolean,
      default: false,
    },
    playerCategory: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      scoreboard: [],
      loading: false,
      users: {},
      page: 0,
      limit: 15,
    };
  },
  watch: {
    async playerCategory() {
      await this.loadGraph();
      await this.getUsers();
    },
  },
  async mounted() {
    this.loading = true;
    await this.loadGraph();
    await this.getUsers();
    this.loading = false;
  },
  methods: {
    async loadGraph() {
      this.scoreboard = await this.$api.default.scoreboard(this.playerCategory?.id);
      let datasets = [];

      for (const team of this.scoreboard.standings) {
        let totalPoints = [];
        let totalScore = 0;
        team.taskStats = Object.entries(team.taskStats)
          .map((r) => ({ challenge: r[0], ...r[1] }))
          .sort((a, b) => a.time - b.time);

        for (const task of team.taskStats) {
          totalScore += task.points;
          totalPoints.push({
            x: task.time,
            y: totalScore,
            challenge: task.challenge,
          });
        }
        datasets.push({
          label: team.team,
          data: totalPoints,
          fill: false,
          borderColor: this.stringToColour(team.team),
          lineTension: 0,
        });
      }
      this.constructChart(datasets);
    },
    async getUsers() {
      if (this.$store.state.ctfOptions.teamMode)
        this.users = await this.$api.teams.getAll(
          this.limit,
          this.page,
          this.playerCategory?.id
        );
      else
        this.users = await this.$api.users.getAll(
          this.limit,
          this.page,
          this.playerCategory?.id
        );
    },
    async changePage(page) {
      this.page = page;
      await this.getUsers();
    },
    stringToColour(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = "#";
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
    },
    async constructChart(datasets) {
      let ctx = this.$refs["scoreboard"];
      if (!ctx) return;
      var options = {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "minute",
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              const time = tooltipItem[0].xLabel;
              const challenge =
                data.datasets[tooltipItem[0].datasetIndex].data[
                  tooltipItem[0].index
                ].challenge;

              return `${challenge}`; // : ${time}
            },
          },
        },
      };

      new Chart(ctx, {
        type: "line",
        data: {
          datasets,
        },
        options: options,
      });
    },
  },
};
</script>
