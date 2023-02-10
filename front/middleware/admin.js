export default function ({ $auth,redirect  }) {
  if($auth.user?.role == 1){
    return redirect('/')
  }
}
