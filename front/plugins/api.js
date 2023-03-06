import Auth from "@/api/auth";
import Categories from "@/api/categories";
import Challenges from "@/api/challenges";
import Config from "@/api/config";
import Default from "@/api/default";
import Deployer from "@/api/deployer";
import Events from "@/api/events";
import Submissions from "@/api/submissions";
import Teams from "@/api/teams";
import Users from "@/api/users";

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
    events: Events(instance),
    deployer: Deployer(instance),
  };
}

export default (ctx, inject) => {
  inject("api", createRepository(ctx.$axios));
};
