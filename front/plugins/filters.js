import Vue from "vue";
import moment from "moment";

Vue.filter("truncate", function (text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
});

Vue.filter("moment", function (text, filter = "MMMM Do YYYY, h:mm:ss a") {
  return moment(text).format(filter);
});
