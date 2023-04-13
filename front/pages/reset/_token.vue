<template>
  <div class="bg-gray-100 h-screen w-full p-16" v-if="valid">
    <div class="bg-white rounded-sm shadow p-16 mx-auto">
      <h2 class="text-2xl">Set a new password</h2>
      <InputText
      class="mb-8 mt-4"
        type="password"
        v-model="password"
        autocomplete="password"
      />
      <Button :loading="loading" @clicked="reset">Reset</Button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "none",
  middleware: "guest",
  data() {
    return {
      password: "",
      valid: true,
      loading: false
    };
  },
  async fetch() {
    try {
      this.valid = await this.$api.auth.resetLink(this.$route.params.token);
    } catch (err) {
      if (err.isAxiosError) {
        this.$toast.error(err.response.data.message);
      } else {
        this.$toast.error("Error");
      }
      this.$router.push("/");
    }
  },
  methods: {
    async reset() {
      this.loading = true
      try {
        await this.$api.auth.setNewPassword(
          this.$route.params.token,
          this.password
        );
        this.$toast.success("Password changed!");
        this.$router.push("/");
      } catch (err) {
        if (err.isAxiosError) {
          this.$toast.error(err.response.data.message);
        } else {
          this.$toast.error("Error");
        }
      }
      this.loading = false
    },
  },
};
</script>
