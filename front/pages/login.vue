<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <InputText type="text" label="Email" v-model="login.email" />
      </div>
      <div>
        <InputText type="password" label="Password" v-model="login.password" />
      </div>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.login,
        });
        this.$toast.success("Welcome back !");
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
      }
    },
  },
};
</script>
