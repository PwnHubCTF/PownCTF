export default async function ({ $auth, redirect, store }) {
  if (!$auth.loggedIn) {
    return redirect(`/`);
  }

  if (!store.state.ctfOptions.teamMode) {
    return redirect("/profile");
  }
}
