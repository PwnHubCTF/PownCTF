export default async function ({ $auth, redirect, store }) {
  if (!$auth.loggedIn) {
    return redirect("/");
  }

  if (!$auth.ready) {
    if (store.state.ctfOptions.state === "waiting") {
      return redirect("/profile");
    }

    if (store.state.ctfOptions.categoryMode && !$auth.user?.categoryId) {
      return redirect("/category");
    }

    if (store.state.ctfOptions.teamMode && !$auth.user.teamId) {
      return redirect("/team");
    }
  }

  $auth.ready = true;
}
