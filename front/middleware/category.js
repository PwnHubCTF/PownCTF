export default async function ({ $auth, redirect, store }) {
  if (!$auth.loggedIn) {
    return redirect("/");
  }

  if (!store.state.ctfOptions.categoryMode) {
    return redirect("/profile");
  }

  if ($auth.user?.categoryId) {
    return redirect("/challenges");
  }
}
