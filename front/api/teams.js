import { forceJsonFileDownload } from "../common/download.js";
const BASE = "/teams";

export default ($axios) => ({
  async create(name, password) {
    let res = await $axios.post(`${BASE}`, { name, password });
    return res.data;
  },
  async dump() {
    let res = await this.$axios.get(`${BASE}/admin/?limit=0&page=0`);
    forceJsonFileDownload(res.data.data, 'teams.json')
  },
  async getAll(limit = 10, page = 0, filters = null) {
    let filterQuery = []
    for(const filter in filters){
      if(filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`)
    }
    let res = await $axios.get(`${BASE}/?limit=${limit}&page=${page}&${filterQuery.join('&')}`);
    return res.data;
  },
  async getAllList(limit = 10, page = 0, filters = null) {
    let filterQuery = []
    for(const filter in filters){
      if(filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`)
    }
    let res = await $axios.get(`${BASE}/list/?limit=${limit}&page=${page}&${filterQuery.join('&')}`);
    return res.data;
  },
  async getAdmin(limit = 10, page = 0, filters = null) {
    let filterQuery = []
    for(const filter in filters){
      if(filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`)
    }
    let res = await $axios.get(`${BASE}/admin/?limit=${limit}&page=${page}&${filterQuery.join('&')}`);
    return res.data;
  },
  async join(name, password) {
    let res = await $axios.post(`${BASE}/join`, { name, password });
    return res.data;
  },
  async directJoinInfos(secret) {
    let res = await $axios.post(`${BASE}/join/infos/${secret}`);
    return res.data;
  },
  async kickPlayer(userId) {
    let res = await $axios.delete(`${BASE}/kick/${userId}`);
    return res.data;
  },
  async directJoin(secret) {
    let res = await $axios.post(`${BASE}/join/direct/${secret}`);
    return res.data;
  },
  async getMine() {
    let res = await $axios.get(`${BASE}/mine`);
    return res.data;
  },
  async get(id) {
    let res = await $axios.get(`${BASE}/${id}`);
    return res.data;
  },
  async free(limit = 10, page = 0) {
    let res = await $axios.get(`${BASE}/free?limit=${limit}&page=${page}`);
    return res.data;
  },
  async setOpen(open){
    let res = await $axios.patch(`${BASE}`, {
      open
    });
    return res.data;
  },
  async edit(id, data){
    let res = await $axios.patch(`${BASE}/${id}`, data);
    return res.data;
  },
  async getOneAdmin(id){
    let res = await $axios.get(`${BASE}/admin/${id}`);
    return res.data;
  }
});
