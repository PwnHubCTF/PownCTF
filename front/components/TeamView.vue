<template>
  <div class="text-center p-8" v-if="team">
    <h1 class="text-4xl font-medium my-8">{{ team.name }}</h1>
    <table class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
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
          v-for="(player, index) of team.users"
          :key="index"
        >
          <td class="py-2">{{ index + 1 }}</td>
          <td>
            <NuxtLink :to="`/user/${player.id}`">{{ player.pseudo }}</NuxtLink>
          </td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center">
      <div class="w-3/4">
        <canvas ref="scoreboard"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teamId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      team: null,
      submissions: null,
    };
  },
  async fetch() {
    await this.getData();
  },
  async mounted() {
    if (!this.team) await this.getData();
    if (this.$store.state.ctfOptions.state !== "waiting") {
      this.buildScoreboard();
    }
  },
  methods: {
    async getData() {
      this.team = await this.$api.teams.get(this.teamId);
      this.submissions = await this.$api.submissions.forTeam(this.teamId);
    },
    async buildScoreboard() {
      console.log(this.submissions);
      if (this.submissions.length > 0) {
        this.totalPoints = this.submissions
          .map((f) => f.points)
          .reduce((a, b) => a + b);

        let data = [];

        for (let i = 0; i < this.submissions.length; i++) {
          if (i == 0) {
            data.push(this.submissions[i].points);
          } else {
            data.push(data[i - 1] + this.submissions[i].points);
          }
        }

        let ctx = this.$refs["scoreboard"];
        if (!ctx) return;
        new Chart(ctx, {
          type: "line",
          data: {
            labels: this.submissions.map((s) => s.name),
            datasets: [
              {
                label: "Score",
                data: data,
                backgroundColor: "rgba(84, 235, 65, 0.30)",
                borderColor: "#80ff80",
              },
            ],
          },
          options: {
            responsive: true,
            hover: {
              mode: "label",
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  display: true,
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            title: {
              display: true,
              text: "Score progression",
            },
          },
        });
      }
    },
  },
};
</script>
