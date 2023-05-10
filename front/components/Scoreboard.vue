<template>
  <div class="p-0 md:p-2 lg:p-8" v-if="$store.state.ctfOptions.state !== 'waiting'">
    <div class="w-full md:w-3/4 lg:w-3/5 mx-auto">
      <client-only>
        <canvas ref="scoreboard"></canvas>
      </client-only>
    </div>
    <TablePaginate
      :headers="headers"
      :getRoute="$store.state.ctfOptions.teamMode ? $api.teams.getAll : $api.users.getAll"
      :filters="filters"
    >
      <template v-slot:pseudo="{ item }">
        <NuxtLink
          v-if="$store.state.ctfOptions.teamMode"
          :to="`/team/${item.id}`"
          >{{ item.pseudo }}</NuxtLink
        >
        <NuxtLink v-else :to="`/user/${item.id}`">{{
          item.pseudo
        }}</NuxtLink>
      </template>
    </TablePaginate>
  </div>
  <div v-else>CTF is not started</div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-adapter-moment";

export default {
  props: {
    playerCategory: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      scoreboard: [],
      loading: false,
      headers: [
        { name: "#", value: "rank" },
        {
          name: this.$store.state.ctfOptions.teamMode ? "Team" : "Player",
          value: "pseudo",
        },
        { name: "Score", value: "points" },
      ],
    };
  },
  watch: {
    async filters() {
      await this.loadGraph();
    },
  },
  async mounted() {
    this.loading = true;
    await this.loadGraph();
    this.loading = false;
  },
  computed: {
    filters() {
      return {
        category: this.playerCategory?.id,
      };
    },
  },
  methods: {
    async loadGraph() {
      if(this.$store.state.ctfOptions.state === 'waiting') return
      this.scoreboard = await this.$api.default.scoreboard(
        this.playerCategory?.id
      );
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
