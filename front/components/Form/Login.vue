<template>
    <form
      class="w-full"
      @submit.prevent="userLogin"
    >
      <InputText
        class="my-2 text-left"
        required
        type="email"
        label="Email"
        v-model="login.email"
        autocomplete="email"
      />
      <InputText
        class="my-2 text-left"
        required
        type="password"
        label="Password"
        v-model="login.password"
        autocomplete="current-password"
      />
      <Button :loading="loading" class="mt-8" type="submit">Login</Button>
    </form>
</template>

<script>
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async userLogin() {
      this.loading = true;
      try {
        await this.$auth.loginWith("local", {
          data: this.login,
        });
        this.$toast.success("Welcome back !");
        const teamJoin = this.$route.query["join"];
        if (teamJoin) {
          this.$router.push(`/team?join=${teamJoin}`);
        } else {
          this.$router.push(`/profile`);
        }
      } catch (err) {
        if (err.isAxiosError) {
          if (err.response.status == 403)
            this.$toast.error("Invalid credentials");
          else if (err.response.status == 422)
            this.$toast.error("Invalid fields");
          else this.$toast.error("Unknow error (A)");
        } else {
          this.$toast.error("Unknow error (B)");
        }
        this.loading = false;
      }
    },
  },
};
</script>
