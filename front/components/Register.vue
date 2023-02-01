<template>
  <div class="flex justify-center items-center bg-2600blue">
    <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent="userLogin">
      <InputText
        labelColor="text-white"
        type="text"
        required
        label="Pseudo"
        v-model="login.pseudo"
      />

      <InputText
        labelColor="text-white"
        type="text"
        required
        label="Email"
        v-model="login.email"
      />
      <InputText
        labelColor="text-white"
        type="password"
        required
        label="Password"
        v-model="login.password"
      />
      <Button :loading="loading" class="mt-8" type="submit"
        >Create an account</Button
      >
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
      this.loading = false;
    },
  },
};
</script>
