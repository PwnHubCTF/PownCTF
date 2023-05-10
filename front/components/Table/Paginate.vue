<template>
  <div class="overflow-x-auto relative w-full">
    <Table :loading="loading" :headers="headers" :items="items">
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </Table>
    <Pagination
      :current="current"
      :total="total"
      :per-page="perPage"
      @page-changed="current = $event"
      @per-page="changePerPage($event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    headers: Array,
    filters: Object,
    getRoute: Function,
  },
  data() {
    return {
      current: 1,
      total: 0,
      items: [],
      perPage: 10
    };
  },
  watch: {
    async current() {
      await this.getData();
    },
    async filters() {
      if (this.current == 1) {
        await this.getData();
      } else {
        this.current = 1;
      }
    },
  },
  async fetch() {
    await this.getData();
  },
  methods: {
    async getData() {
      const res = await this.getRoute(
        this.perPage,
        this.current - 1,
        this.filters
      );
      this.items = res.data;
      this.total = res.count;
    },
    async refresh() {
      await this.getData();
    },
    changePerPage(value){
      this.perPage = value
      this.refresh()
    }
  },
};
</script>
