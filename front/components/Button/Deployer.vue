<template>
  <div class="flex items-center flex-wrap">
    <span v-if="instance?.serverUrl && state == 'started'"
      ><a
        v-if="challenge.web"
        :href="`http://${instance.serverUrl}:${instance.port}`"
        target="_blank"
        >http://{{ instance.serverUrl }}:{{ instance.port }}</a
      >
      <span v-else>{{ instance.serverUrl }} {{ instance.port }}</span></span
    >
    <span class="italic text-red-500" v-if="state == 'down'"
      >Deployer is down</span
    >
    <span class="italic text-orange-500" v-if="state == 'stopped'"
      >Deploy your challenge instance</span
    >
    <span
      class="italic text-gray-500"
      v-if="instance?.progress && state == 'loading'"
      >{{ instance.progress }}</span
    >
    <span
      class="italic text-gray-500"
      v-if="instance?.destroyAt && state == 'started'"
      ><div class="mx-8"><Countdown v-if="!loadRefresh" @over="stop" :end="instance.destroyAt" />
      <span class="italic" v-else>reseting...</span>
      </div
    ></span>
    <svg
      v-if="state == 'stopped'"
      class="ml-2 w-6 h-6 text-green-500 cursor-pointer"
      style="min-height: 1.5rem; min-width: 1.5rem"
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
      style="min-height: 1.5rem; min-width: 1.5rem"
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
      style="min-height: 1.5rem; min-width: 1.5rem"
      fill="currentColor"
      viewBox="0 0 512 512"
      v-tooltip="'Stop instance'"
      @click="stop()"
    >
      <path
        d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
      />
    </svg>
    <svg
      v-if="state == 'loading' || loadRefresh == true"
      style="min-height: 1.5rem; min-width: 1.5rem"
      class="ml-2 w-6 h-6 text-gray-500 spin"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path
        d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"
      />
    </svg>
    <svg
      v-if="state == 'started' && challenge.instance == 'multiple' && loadRefresh == false"
      class="ml-2 w-6 h-6 text-orange-500 cursor-pointer"
      style="min-height: 1.5rem; min-width: 1.5rem"
      fill="currentColor"
      viewBox="0 0 512 512"
      v-tooltip="'Reset destroy countdown to 1h'"
      @click="resetCooldown()"
    >
      <path d="M447.5 224H456c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L397.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L311 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H447.5z"/>
    </svg>

  </div>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      state: "unknown",
      instance: null,
      loadRefresh: false
    };
  },
  async mounted() {
    await this.fetchStatus();
  },
  methods: {
    async fetchStatus() {
      try {
        this.instance = await this.$api.challenges.instanceStatus(
          this.challenge.id
        );

        if (this.instance.serverUrl) {
          this.state = "started";
          let url = this.challenge.web ? `http://${this.instance.serverUrl}:${this.instance.port}` : `${this.instance.serverUrl} ${this.instance.port}`
          this.$emit('started', url)
        } else if (this.instance.progress) {
          this.state = "loading";
          await new Promise((r) => setTimeout(r, 500));
          await this.fetchStatus();
        } else {
          this.state = "stopped";
          this.$emit('stopped')
        }
      } catch (error) {
        this.state = "down";
      }
    },
    async start() {
      this.state = "loading";
      await this.$api.challenges.deploy(this.challenge.id).catch((err) => {
        if (err.response?.data.message)
          this.$toast.error(err.response.data.message);
      });
      await this.fetchStatus();
    },
    async resetCooldown() {
      this.loadRefresh = true
      await this.$api.challenges.resetCooldown(this.challenge.id).catch((err) => {
        if (err.response?.data.message)
          this.$toast.error(err.response.data.message);
      });
      await this.fetchStatus();
      this.loadRefresh = false
    },
    async stop() {
      this.state = "loading";
      await this.$api.challenges.stop(this.challenge.id).catch((err) => {
        if (err.response?.data.message)
          this.$toast.error(err.response.data.message);
      });
      await new Promise((r) => setTimeout(r, 1000));
      await this.fetchStatus();
    },
  },
};
</script>

<style></style>
