export default function ({ $auth,redirect  }) {
  if($auth.loggedIn && $auth.user.role !== 2){
    return redirect('/')
  }
}
