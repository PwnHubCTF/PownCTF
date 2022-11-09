export default async function ({ $auth,redirect, $api  }) {
    if(!$auth.loggedIn){
      return redirect('/login')
    }

    let categoryMode = await $api.categories.getCategoryMode()
    if(!categoryMode){
        return redirect('/profile')
    }
  }
  