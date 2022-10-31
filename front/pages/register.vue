<template>
  <div>
    <form @submit.prevent="userLogin">
      <InputText type="text" required label="Pseudo" v-model="login.pseudo" />

      <InputText type="text" required label="Email" v-model="login.email" />
      <InputText
        type="password"
        required
        label="Password"
        v-model="login.password"
      />
      <Button type="submit">Register</Button>
    </form>
  </div>
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
    };
  },
  methods: {
    async userLogin() {
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
        this.$toast.success("Welcome !");
      } catch (err) {
        if (err.isAxiosError) {
          if (err.response.status == 422) this.$toast.error("Invalid fields");
          else if (err.response.status == 409)
            this.$toast.error(err.response.data.message);
          else this.$toast.error("Unknow error (A)");
        } else {
          this.$toast.error("Unknow error (B)");
        }
      }
    },
  },
};
</script>
