export default function ({ $axios, app, $toast }) {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    if ([401].includes(code)) {
      app.$auth.logout();
    }

    if (error.response?.data.message)
      $toast.error(error.response.data.message);
    else $toast.error(error.message);

    return Promise.reject(error);
  })
}
