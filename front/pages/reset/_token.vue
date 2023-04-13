<template>
  <div>
    Reset password:
    <input type="text" v-model="password" />
    <p @click="reset">Reset</p>
  </div>
</template>

<script>
export default {
  layout: "none",
  middleware: "guest",
  data() {
    return {
      password: "",
    };
  },
  async fetch() {
    try {
      await this.$api.auth.resetLink(this.$route.params.token);
    } catch (err) {
      if (err.isAxiosError) {
        this.$toast.error(err.response.data.message);
        this.$router.push("/");
      } else {
        this.$toast.error("Error");
      }
    }
  },
  methods: {
    async reset() {
      try {
        const token = await this.$api.auth.setNewPassword(
          this.$route.params.token,
          this.password
        );
        this.$toast.success("Password changed!");
        this.$router.push('/')
      } catch (err) {
        if (err.isAxiosError) {
          this.$toast.error(err.response.data.message);
        } else {
          this.$toast.error("Error");
        }
      }
    },
  },
};
</script>
