<template>
  <div class="flex items-center">
    <span v-if="instance?.url && state == 'started'"
      ><a :href="instance.url" target="_blank">{{ instance.url }}</a></span
    >
    <span class="italic text-gray-500" v-if="instance?.progress && state == 'loading'">{{
      instance.progress
    }}</span>
    <svg
      v-if="state == 'stopped'"
      class="ml-2 w-6 h-6 text-green-500 cursor-pointer"
      fill="currentColor"
      viewBox="0 0 512 512"
      v-tooltip="'Start instance'"
      @click="start()"
    >
      <path
        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
      />
    </svg>
    <svg
      v-if="state == 'unknown'"
      class="ml-2 w-6 h-6 text-gray-300"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path
        d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"
      />
    </svg>
    <svg
      v-if="state == 'loading'"
      class="ml-2 w-6 h-6 text-gray-500 spin"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path
        d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"
      />
    </svg>
    <svg
      v-if="state == 'started'"
      class="ml-2 w-6 h-6 text-red-500 cursor-pointer"
      fill="currentColor"
      viewBox="0 0 512 512"
      v-tooltip="'Stop instance'"
      @click="stop()"
    >
      <path
        d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: ["challengeId"],
  data() {
    return {
      state: "unknown",
      instance: null,
    };
  },
  async fetch() {
    await this.fetchStatus();
  },
  methods: {
    async fetchStatus() {
      this.instance = await this.$api.challenges.instanceStatus(
        this.challengeId
      );

      if (this.instance.url) {
        this.state = "started";
      } else if (this.instance.progress) {
        this.state = "loading";
        await new Promise((r) => setTimeout(r, 500));
        await this.fetchStatus();
      } else {
        this.state = "stopped";
      }
    },
    async start() {
      this.state = "loading";
      await this.$api.challenges.deploy(this.challengeId).catch((err) => {
        if (err.response?.data.message)
          this.$toast.error(err.response.data.message);
      });
      await this.fetchStatus();
    },
    async stop() {
      this.state = "loading";
      await this.$api.challenges.stop(this.challengeId).catch((err) => {
        if (err.response?.data.message)
          this.$toast.error(err.response.data.message);
      });
      await new Promise((r) => setTimeout(r, 3000));
      await this.fetchStatus();
    },
  },
};
</script>

<style></style>
