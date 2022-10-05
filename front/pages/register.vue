<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Pseudo</label>
        <input type="text" v-model="login.pseudo" />
      </div>
      <div>
        <label>Email</label>
        <input type="text" v-model="login.email" />
      </div>
      <div>
        <label>Password</label>
        <input type="text" v-model="login.password" />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
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
        await this.$axios.post("/auth/register", this.login);
        await this.$auth.loginWith("local", {
          data: this.login,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
