export default async function ({ $auth,redirect, $api  }) {
    if(!$auth.loggedIn){
      return redirect(`/login`)
    }

    let teamMode = await $api.config.getTeamMode()
    if(!teamMode){
        return redirect('/profile')
    }
  }
  