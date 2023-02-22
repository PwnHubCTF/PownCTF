<template>
    <div class="text-gray-900">
        <!-- Connection / Sign Up -->
        <div class="flex justify-center uppercase text-gray-700 font-extrabold">
            <div @click="state = 'login'" :class="{'border-gray-800 border-b-2': state == 'login'}" class="cursor-pointer py-3 px-3 mx-2">Connection</div>
            <div @click="state = 'register'" :class="{'border-gray-800 border-b-2': state == 'register'}" class="cursor-pointer py-3 px-3 mx-2">Inscription</div>
        </div>
        <!-- Form -->
        <FormLogin v-if="state == 'login'"/>
        <FormRegister v-if="state == 'register'"/>
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
};
</script>
