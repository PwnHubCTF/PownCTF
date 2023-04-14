<template>
    <div class="text-gray-900 px-16 py-8">
        <!-- Connection / Sign Up -->
        <div class="flex justify-center uppercase text-gray-700 font-bold">
            <div @click="current = 'login'" :class="{'border-gray-800 border-b-2': current == 'login'}" class="cursor-pointer py-3 px-3 mx-2">Connection</div>
            <div v-if="$store.state.ctfOptions.state != 'finished'" @click="current = 'register'" :class="{'border-gray-800 border-b-2': current == 'register'}" class="cursor-pointer py-3 px-3 mx-2">Inscription</div>
        </div>
        <!-- Form -->
        <div class="my-8">

        <FormLogin v-if="current == 'login'"/>
        <FormRegister v-if="current == 'register'"/>
        <FormForgot v-if="current == 'forgot'"/>
        <p v-if="current != 'forgot'" @click="current = 'forgot'" class="text-right mt-1 cursor-pointer hover:text-gray-700 duration-100 transition-all underline">Forgot password ?</p>

        </div>
        <!-- CTF Time -->
        <div
          v-if="false && $store.state.ctfOptions.state != 'finished'"
          class="relative flex mt-2 mb-3 px-4 items-center"
        >
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
          <span class="flex-shrink mx-4 text-gray-500">or</span>
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
        </div>

        <Button v-if="false" class="bg-blue-800">Connect with CTF Time</Button>
    </div>
</template>

<script>
export default {
    props: {
        state: {
            type: String,
            required: true
        }
    },
    data(){
      return {
        current: ''
      }
    },
    mounted(){
      this.current = this.state
    }
};
</script>
