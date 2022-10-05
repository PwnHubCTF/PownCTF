import Auth from "@/api/auth";
import Config from "@/api/config";

function createRepository(instance) {
  return {
    auth: Auth(instance),
    config: Config(instance),
  };
}

export default (ctx, inject) => {
  inject("api", createRepository(ctx.$axios));
};
