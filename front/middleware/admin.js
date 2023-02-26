export default function ({ $auth,redirect  }) {
  if (!$auth.loggedIn) {
    return redirect("/");
  }
  
  if($auth.user?.role == 1){
    return redirect('/')
  }
}
