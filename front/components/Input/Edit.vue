<template>
  <div>
    <InputText
      :label="label"
      :type="type"
      :value="value"
      @input="changeEvent"
      :placeholder="placeholder"
      :required="required"
      :choices="choices"
    />
    <Button
      v-if="hasChanged"
      :loading="loading"
      @clicked="editValue"
      class="mt-2"
    >
      Save
    </Button>
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
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    choices: {
      type: Array,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newValue: "",
      hasChanged: false,
    };
  },
  mounted() {
    this.newValue = this.value;
  },
  watch: {
    value() {
      this.hasChanged = this.newValue != this.value;
    },
  },
  methods: {
    changeEvent(e) {
      this.newValue = e;
      this.hasChanged = this.newValue != this.value;
    },
    editValue() {
      this.$emit("edited", this.newValue);
    },
  },
};
</script>
