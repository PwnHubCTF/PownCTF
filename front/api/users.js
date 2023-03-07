const BASE = "/users";

export default ($axios) => ({
  async getAll(limit = 10, page = 0, filters = null) {
    let filterQuery = []
    for(const filter in filters){
      if(filters[filter]) filterQuery.push(`${filter}=${filters[filter]}`)
    }
    let res = await $axios.get(`${BASE}/?limit=${limit}&page=${page}&${filterQuery.join('&')}`);
    return res.data;
  },
  async changeRole(userId, role) {
    let res = await $axios.post(`${BASE}/rank/${userId}`, {
      role,
    });
    return res.data;
  },
  async getOne(id) {
    let res = await $axios.get(`${BASE}/infos/${id}`);
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
  async getForCategory(category) {
    let res = await $axios.get(`${BASE}/category/${category}`);
    return res.data;
  },
});
