<template>
    <form
      class="w-full"
      @submit.prevent="userLogin"
    >
      <InputText
        class="my-2 text-left"
        type="text"
        required
        label="Pseudo"
        v-model="login.pseudo"
        autocomplete="username"
      />

      <InputText
        class="my-2 text-left"
        type="email"
        required
        label="Email"
        v-model="login.email"
        autocomplete="email"
      />
      <InputText
        class="my-2 text-left"
        type="password"
        required
        label="Password"
        v-model="login.password"
        autocomplete="new-password"
      />
      <Button :loading="loading" class="mt-8" type="submit"
        >Create an account</Button
      >
    </form>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      login: {
        pseudo: "",
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
        await this.$api.auth.register(
          this.login.pseudo,
          this.login.email,
          this.login.password
        );
        this.$toast.success("Account created");
        await this.$auth.loginWith("local", {
          data: this.login,
        });
        const teamJoin = this.$route.query["join"];
        if (teamJoin) {
          this.$router.push(`/team?join=${teamJoin}`);
        } else {
          this.$router.push(`/profile`);
        }
        this.$toast.success("Welcome !");
      } catch (err) {
        if (err.isAxiosError) {
          this.$toast.error(err.response.data.message);
        } else {
          this.$toast.error("Unknow error (B)");
        }
      }
      this.loading = false;
    },
  },
};
</script>
