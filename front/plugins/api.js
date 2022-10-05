import Auth from "@/api/auth";
import Config from "@/api/config";
import Teams from "@/api/teams";
import Categories from "@/api/categories";
import Users from "@/api/users";

function createRepository(instance) {
  return {
    auth: Auth(instance),
    categories: Categories(instance),
    config: Config(instance),
    teams: Teams(instance),
    users: Users(instance),
  };
}

export default (ctx, inject) => {
  inject("api", createRepository(ctx.$axios));
};
