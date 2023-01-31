<template>
  <div>
    <div class="text-center">
      <h1 class="text-6xl py-8">{{ $auth.user.pseudo }}</h1>
      <p>{{ totalPoints }} points</p>
    </div>
    <canvas ref="scoreboard"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import "chartjs-adapter-moment";

export default {
  middleware: "auth",
  data() {
    return {
      user: null,
      submissions: [],
      totalPoints: 0,
    };
  },
  async mounted() {
    this.submissions = await this.$api.submissions.getForUser(
      this.$auth.user.id
    );

    this.totalPoints = this.submissions
      .map((f) => f.points)
      .reduce((a, b) => a + b);
    const ctx = this.$refs["scoreboard"];

    let data = [];

    for (let i = 0; i < this.submissions.length; i++) {
      if (i == 0) {
        data.push(this.submissions[i].points);
      } else {
        data.push(data[i - 1] + this.submissions[i].points);
      }
    }

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
            borderCapStyle: "butt",
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        hover: {
          mode: "label",
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
      },
    });
  },
};
</script>
