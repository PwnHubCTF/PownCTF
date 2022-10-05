export default function ({ $auth,redirect  }) {
  if($auth.loggedIn && $auth.user.role !== 3){
    return redirect('/')
  }
}
