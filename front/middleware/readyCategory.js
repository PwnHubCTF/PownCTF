export default async function ({ $auth, redirect, store }) {
    if(!$auth.loggedIn){
        redirect("/");
    }
    if (store.state.ctfOptions.categoryMode && !$auth.user.categoryId) {
        return redirect("/category");
    }
}
