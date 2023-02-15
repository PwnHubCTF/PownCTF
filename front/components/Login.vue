<template>
  <div class="flex justify-center items-center bg-2600blue">
    <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent="userLogin">
      <div>
        <InputText
          labelColor="text-white"
          type="text"
          label="Email"
          v-model="login.email"
          autocomplete='email'
        />
      </div>
      <div>
        <InputText
          labelColor="text-white"
          type="password"
          label="Password"
          v-model="login.password"
          autocomplete='current-password'
        />
      </div>
      <div>
        <Button :loading="loading" class="mt-8" type="submit">Login</Button>
      </div>
    </form>
  </div>
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
        if(teamJoin){
          this.$router.push(`/team?join=${teamJoin}`)
        } else {
          this.$router.push(`/profile`)
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
