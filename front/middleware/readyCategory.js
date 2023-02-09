export default async function ({ $auth, redirect, store }) {
    if (store.state.ctfOptions.categoryMode && !$auth.user.categoryId) {
        return redirect("/category");
    }
}
