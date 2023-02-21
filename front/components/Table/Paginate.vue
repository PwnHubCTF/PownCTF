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
      />
    </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    headers: Array,
    getRoute: Function,
    reload: String
  },
  data(){
    return {
      current: 1,
      perPage: 10,
      total: 0,
      items: []
    }
  },
  watch: {
    async current() {
      await this.getData();
    },
    async reload(){
      await this.getData();
    }
  },
  async fetch() {
    await this.getData();
  },
  methods: {
    async getData() {
      const res = await this.getRoute(this.perPage, this.current-1);
      this.items = res.data
      this.total = res.count
    },
  },
};
</script>
