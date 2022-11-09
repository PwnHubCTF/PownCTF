export default async function ({ $auth,redirect, $api  }) {
    if(!$auth.loggedIn){
      return redirect('/login')
    }
    
    let state = await $api.config.getCtfState()
    if (state === 'waiting'){
        return redirect('/profile')
    }

    let categoryMode = await $api.categories.getCategoryMode()
    if(categoryMode && !$auth.user.categoryId){
      return redirect('/category')
    }

    let teamMode = await $api.config.getTeamMode()
    if(teamMode && !$auth.user.teamId){
        return redirect('/team')
    }
  }
  