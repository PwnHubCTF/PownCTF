import Default from "@/api/default";
import Auth from "@/api/auth";
import Config from "@/api/config";
import Teams from "@/api/teams";
import Challenges from "@/api/challenges";
import Categories from "@/api/categories";
import Users from "@/api/users";
import Submissions from "@/api/submissions";

function createRepository(instance) {
  return {
    default: Default(instance),
    auth: Auth(instance),
    categories: Categories(instance),
    challenges: Challenges(instance),
    config: Config(instance),
    teams: Teams(instance),
    users: Users(instance),
    submissions: Submissions(instance),
  };
}

export default (ctx, inject) => {
  inject("api", createRepository(ctx.$axios));
};
