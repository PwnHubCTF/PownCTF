import { forceJsonFileDownload } from "../common/download.js";
const BASE = "/users";

export default ($axios) => ({
  async getAll(limit = 10, page = 0, filters = null) {
    let filterQuery = [];
    for (const filter in filters) {
      if (filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`);
    }
    let res = await $axios.get(
      `${BASE}/?limit=${limit}&page=${page}&${filterQuery.join("&")}`
    );
    return res.data;
  },
  async getAllUsers(limit = 10, page = 0, filters = null) {
    let filterQuery = [];
    for (const filter in filters) {
      if (filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`);
    }
    let res = await $axios.get(
      `${BASE}/all-users/?limit=${limit}&page=${page}&${filterQuery.join("&")}`
    );
    return res.data;
  },
  async dump() {
    let res = await this.$axios.get(`${BASE}/admin/?limit=0&page=0`);
    forceJsonFileDownload(res.data.data, "users.json");
  },
  async changeRole(userId, role) {
    let res = await $axios.post(`${BASE}/rank/${userId}`, {
      role,
    });
    return res.data;
  },
  async kickFromTeam(userId) {
    let res = await $axios.delete(`${BASE}/team/${userId}`);
    return res.data;
  },
  async kickFromCategory(userId) {
    let res = await $axios.delete(`${BASE}/category/${userId}`);
    return res.data;
  },
  async getOne(id) {
    let res = await $axios.get(`${BASE}/infos/${id}`);
    return res.data;
  },
  async delete(id) {
    let res = await $axios.delete(`${BASE}/${id}`);
    return res.data;
  },
  async getAdmin(limit = 10, page = 0, filters = null) {
    let filterQuery = [];
    for (const filter in filters) {
      if (filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`);
    }
    let res = await $axios.get(
      `${BASE}/admin/?limit=${limit}&page=${page}&${filterQuery.join("&")}`
    );
    return res.data;
  },
  async getForCategory(category) {
    let res = await $axios.get(`${BASE}/category/${category}`);
    return res.data;
  },
  async edit(id, data){
    let res = await $axios.patch(`${BASE}/${id}`, data);
    return res.data;
  },
});
