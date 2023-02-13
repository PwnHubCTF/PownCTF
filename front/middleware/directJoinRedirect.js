export default async function ({query, $auth, redirect, store}) {
    if(query.join){
        if(!$auth.loggedIn){
            redirect(`/?join=${query.join}`)
        }
        if($auth.loggedIn && store.state.ctfOptions.categoryMode && !$auth.user.categoryId){
            redirect(`/category?join=${query.join}`)
        }
    }
  }
  