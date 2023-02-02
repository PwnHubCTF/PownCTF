export default function ({ $auth,redirect  }) {
  if($auth.user?.role !== 3){
    return redirect('/')
  }
}
