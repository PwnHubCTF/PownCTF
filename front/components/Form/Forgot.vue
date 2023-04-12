<template>
  <form class="w-full" @submit.prevent="send">
    <InputText
      class="my-2 text-left"
      required
      type="email"
      label="Email"
      v-model="email"
      autocomplete="email"
    />
    <Button :loading="loading" class="mt-8" type="submit"
      >Send reset link</Button
    >
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async send() {
      this.loading = true;
      try {
        await this.$api.auth.resetPassword(this.email);
        this.$toast.success("Mail sent!");
      } catch (err) {
                if (err.isAxiosError) {
          this.$toast.error(err.response.data.message);
        } else {
          this.$toast.error("Error while sending reset mail");
        }

      }
      this.loading = false;
    },
  },
};
</script>
