<template>
  <div>
    <div v-if="!loading">
      <div class="text-center mb-8">
        <h1 class="text-6xl my-8">{{ user.pseudo }}</h1>
        <p class="text-4xl mb-4 font-medium text-gray-700">
          {{ totalPoints }} points
        </p>
        <span class="text-4xl mb-4 font-medium text-gray-700">Member of
        <NuxtLink :to="`/team/${user.team.id}`" v-if="user.team" class="font-bold hover:text-gray-600">
           {{ user.team.name }}
        </NuxtLink>
      </span>
      </div>
      <div v-if="submissions && submissions.length > 0" class="mx-16">
        <table class="w-full">
          <thead>
            <tr>
              <th>Solved at</th>
              <th>Challenge</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr
              :class="[
                index % 2 == 0
                  ? 'bg-gray-400 text-black'
                  : 'bg-gray-300 text-gray-900',
              ]"
              v-for="(submission, index) of submissions"
              :key="index"
            >
              <td>{{ submission.creation | moment("Do, h:mm:ss a") }}</td>
              <td class="py-4">{{ submission.name }}</td>
              <td>{{ submission.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-center text-3xl mt-12" v-else>No flag yet</div>
    </div>
    <div class="flex justify-center">
      <div class="w-3/4">
        <canvas ref="scoreboard"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-adapter-moment";

export default {
  props: ["id"],
  data() {
    return {
      user: null,
      submissions: [],
      totalPoints: 0,
      loading: true,
    };
  },
  async fetch() {
    this.loading = true;
    this.user = await this.$api.users.getOne(this.id);
    if (this.$store.state.ctfOptions.state !== "waiting") {
      await this.buildScoreboard();
    }
    this.loading = false;
  },
  methods: {
    async buildScoreboard() {
      this.submissions = await this.$api.submissions.getForUser(this.id);
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
