<template>
  <button
    :type="type"
    class="flex items-center w-full hover:bg-opacity-80 px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out rounded-md shadow"
    :class="bgColor"
    :disabled="loading"
    @click="
      () => {
        if (!loading) $emit('clicked');
      }
    "
  >
    <p class="text-center font-bold">
      <slot></slot>
    </p>
    <svg
      v-if="loading"
      class="w-5 h-5 ml-2 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "button",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: "bg-orange-300",
    },
  },
};
</script>
