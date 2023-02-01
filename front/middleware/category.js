export default async function ({ $auth,redirect, $api  }) {

    if(!$auth.loggedIn){
      return redirect('/')
    }

    let categoryMode = await $api.categories.getCategoryMode()
    if(!categoryMode){
        return redirect('/profile')
    }

    if($auth.user.categoryId){
      return redirect('/challenges')
    }
  }
  