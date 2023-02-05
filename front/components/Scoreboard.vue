<template>
  <div class="p-8">
    <canvas v-show="!loading" ref="scoreboard"></canvas>
    <div v-if="loading">Loading...</div>
    <table v-else class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th v-if="isTeamMode">Team</th>
          <th v-else>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr
          :class="[
            index % 2 == 0
              ? 'bg-2600blue text-white'
              : 'bg-gray-300 text-gray-900',
          ]"
          v-for="(player, index) of users.users"
          :key="index"
        >
          <td class="py-2">{{ player.rank }}</td>
          <td v-if="isTeamMode">
            <a :href="`/team/${player.id}`">{{ player.pseudo }}</a>
          </td>
          <td v-else>
            <a :href="`/user/${player.id}`">{{ player.pseudo }}</a>
          </td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
      <div v-if="paginate">
        <p
          v-if="page > 0 && page * limit < users.count"
          @click="changePage(page - 1)"
        >
          Previous
        </p>
        <p
          v-if="(page + 1) * limit < users.count"
          @click="changePage(page + 1)"
        >
          Next
        </p>
      </div>
    </table>
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
  },
  data() {
    return {
      scoreboard: [],
      isTeamMode: null,
      loading: false,
      users: [],
      page: 0,
      limit: 10,
    };
  },
  async mounted() {
    this.loading = true;
    this.isTeamMode = await this.$api.config.getTeamMode();
    this.scoreboard = await this.$api.default.scoreboard();
    this.getUsers();

    let datasets = [];

    for (const team of this.scoreboard.standings) {
      let totalPoints = [];
      let totalScore = 0;
      team.taskStats = Object.entries(team.taskStats)
        .map((r) => ({ challenge: r[0], ...r[1] }))
        .sort((a, b) => a.time - b.time);

      for (const task in team.taskStats) {
        totalScore += team.taskStats[task].points;
        totalPoints.push({
          x: team.taskStats[task].time,
          y: totalScore,
          challenge: task,
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

    this.loading = false;
  },
  methods: {
    async getUsers() {
      if (!this.isTeamMode)
        this.users = await this.$api.users.getAll(this.limit, this.page);
      else this.users = await this.$api.teams.getAll(this.limit, this.page);
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
    constructChart(datasets) {
      const ctx = this.$refs["scoreboard"];
      var options = {
        animation: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "minute",
                tooltipFormat: "h:mm",
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
