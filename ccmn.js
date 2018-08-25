function check_addr() {
    var q = document.getElementById("macaddr");
    var login = document.getElementById("login");
    var s = 0;
    if (q.value === "" || login.value === "") {
      s = 1;
    }
    if (login.value[0] === '?') {
      s = 22;
    }
    else {
      for (var g = 1; g <= 3; g++) {
          var users = get_online_users_by_floor(g);
          for (var i = 0; i < users.length; i++) {
            if (users[i].mac.toString() === q.value.toLowerCase().trim()) {
                q.value = q.value.toLowerCase().trim();
                s = 2;
                break ;
            }
          }
      }
    }
    switch(s) {
      case 1:
        document.getElementById("content").innerHTML = "You have to fill all fields!";
        document.getElementById("content").className = "alert alert-warning";
        break ;
      case 2:
        window.open("map1.html?login=" + login.value + "?macaddr=" + q.value,"_self");
        break ;
      case 22:
        document.getElementById("content").innerHTML = "Login can not begin with '?'. Please, chanhe your login.";
        document.getElementById("content").className = "alert alert-warning";
        break ;
      default:
        document.getElementById("content").innerHTML = "Impossible to find the device with such mac-address. Please, check your Wi-Fi connection or maybe there are typos in your mac-address.";
        document.getElementById("content").className = "alert alert-warning";
  }
}

function check_addr2() {
    window.open("map1.html?login=Guest?macaddr=Guest","_self");
}