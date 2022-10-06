<template>
  <div>
    <InputText
      :label="label"
      :type="type"
      :value="value"
      @input="(e) => $emit('input', e.target.value)"
      :placeholder="placeholder"
      :required="required"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    required: {
      // after:content-['*'] after:ml-0.5 after:text-red-500
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeEvent(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>
