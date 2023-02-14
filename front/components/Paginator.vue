<template>
  <div class="flex justify-between w-full">
    <!-- Page count -->
    <div>{{ page + 1 }} / {{ Math.round(count / limit) }}</div>
    <!-- Next / Previous -->
    <div class="flex">
      <div
        class="border-gray-600 border bg-gray-100 p-4"
        v-if="page > 0 && page * limit < count"
        @click="changePage(page - 1)"
      >
        &lt;
      </div>
      <div
        class="border-gray-600 border bg-gray-100 p-4"
        v-if="(page + 1) * limit < count"
        @click="changePage(page + 1)"
      >
        &gt;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //   props: {
  //     api: {
  //       type: Function,
  //     },
  //   },
  data() {
    return {
      page: 0,
      limit: 10,
      count: 500,
    };
  },
  methods: {
    changePage(page) {
      this.page = page;
      this.$emit("changePage", this.page, this.limit);
    },
  },
  //   async mounted() {
  //     // await this.getAll();
  //   },
  //   methods: {
  //     async getAll() {
  //       const {data, count} = await this.api(this.limit, this.page);
  //       console.log(data, count);
  //       this.objects = data
  //       this.count = count
  //     },
  //   },
};
</script>
