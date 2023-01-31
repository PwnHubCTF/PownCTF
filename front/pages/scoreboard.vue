<template>
  <div class="p-8">
    <canvas ref="scoreboard"></canvas>
    <table class="w-full">
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
          v-for="(player, index) of scoreboard"
          :key="index"
        >
          <td class="py-2">{{ index + 1 }}</td>
          <td v-if="isTeamMode"><a :href="`/team/${player.id}`">{{ player.pseudo }}</a></td>
          <td v-else><a :href="`/user/${player.id}`">{{ player.pseudo }}</a></td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-adapter-moment";

export default {
  data() {
    return {
      scoreboard: [],
      isTeamMode: null
    };
  },
  async mounted() {
    this.isTeamMode = await this.$api.config.getTeamMode()
    const ctx = this.$refs["scoreboard"];
    this.scoreboard = await this.$api.default.scoreboard();
    var stringToColour = function (str) {
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
    };
    let datasets = [];

    for (const player of this.scoreboard) {
      let totalPoints = [];
      const sortedFlag = player.flags.sort((a, b) => a.date - b.date);
      for (let i = 0; i < sortedFlag.length; i++) {
        if (i == 0) {
          totalPoints.push({
            x: sortedFlag[i].date,
            y: sortedFlag[i].points,
            challenge: sortedFlag[i].challengeName,
          });
        } else {
          totalPoints.push({
            x: sortedFlag[i].date,
            y: totalPoints[i - 1].y + sortedFlag[i].points,
            challenge: sortedFlag[i].challengeName,
          });
        }
        this.scoreboard.find(p => p.pseudo == player.pseudo).points = totalPoints[totalPoints.length-1].y
      }
      datasets.push({
        label: player.pseudo,
        data: totalPoints,
        fill: false,
        borderColor: stringToColour(player.pseudo),
        lineTension: 0,
      });
    }

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
};
</script>
