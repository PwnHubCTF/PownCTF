<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Email</label>
        <CustomInput type="text" v-model="login.email" />
      </div>
      <div>
        <label>Password</label>
        <CustomInput type="password" v-model="login.email" />
      </div>
      <div>
        <button type="submit">Submit</button>
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
        };
    },
    methods: {
        async userLogin() {
            try {
                let response = await this.$auth.loginWith("local", {
                    data: this.login,
                });
                this.$toast.success("Welcome back !");
            }
            catch (err) {
                if (err.isAxiosError) {
                    if (err.response.status == 403)
                        this.$toast.error("Invalid credentials");
                    else if (err.response.status == 422)
                        this.$toast.error("Invalid fields");
                    else
                        this.$toast.error("Unknow error (A)");
                }
                else {
                    this.$toast.error("Unknow error (B)");
                }
            }
        },
    }
};
</script>
