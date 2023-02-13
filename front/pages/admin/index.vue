<template>
  <div class="">
    <InputTags
      class="w-1/3 mt-52 mx-auto"
      :autocomplete="autocomplete"
      :actualTags="actualTags"
      @askChoice="query"
      @removeTag="removeTag"
      @addTag="addTag"
    />
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      autocomplete: [],
      actualTags: ["hello"],
    };
  },
  methods: {
    addTag(tag) {
      this.actualTags.push(tag);
      this.autocomplete = []
    },
    removeTag(tag) {
      this.actualTags = this.actualTags.filter((t) => t != tag);
      this.autocomplete = []
    },
    query(tag){
      // API request, to search tag with `tag`
      // Set the result in autocomplete
      this.autocomplete = ["value1", "value2", "hello"]

      // if possible, exclude actualTags from result with api query. Or do it here if you can't
      this.autocomplete = this.autocomplete.filter(t => !this.actualTags.some(at => at == t))
    }
  },
};
</script>
