<template>
  <button
    :type="type"
    class="relative border w-full bg-secondary hover:bg-opacity-90 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out rounded-sm shadow"
    :class="bgColor"
    :disabled="loading"
    @click="
      () => {
        if (!loading) $emit('clicked');
      }
    "
  >
    <p class="text-center w-full font-bold" :class="{ 'opacity-0': loading }">
      <slot></slot>
    </p>
    <div class="w-full h-full relative">
      <svg
        v-if="loading"
        class="w-5 h-5 text-white animate-spin absolute inset-0"
        style="top: -20px; left:calc(50% - 10px)"
        
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
    </div>
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
      default: "bg-secondary",
    },
  },
};
</script>
