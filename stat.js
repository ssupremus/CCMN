function get_online_phones_by_floor(floor) {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_cmx + "/api/location/v2/clients",
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(username_cmx + ":" + password_cmx)
        },
        success: function (responce){
            responce.forEach(function (t) {
                if (t.mapInfo.mapHierarchyString.includes(floor)) {
                    //console.log(t);
                    var user = {};
                    //user.name = t.userName;
                    //user.x = t.mapCoordinate.x;
                    //user.y = t.mapCoordinate.y;
                    //user.mac = t.macAddress;
                    user = t.manufacturer;
                    res.push(user);
                }
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
    return res;
}

  $(document).ready(function getinf(){
  		var sum = get_all_users_count();
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Floor', 'Congestion'],
          ['First floor', get_online_users_by_floor(1).length],
          ['Second floor', get_online_users_by_floor(2).length],
          ['Third floor', get_online_users_by_floor(3).length]
        ]);

        var options = {
          title: "Floor congestion",
          is3D: true,
        };
        if (document.location.href.indexOf('analytics.html') != -1) {
          var chart = new google.visualization.PieChart(document.getElementById('piechart'));
          chart.draw(data, options);
        }
      }
      google.charts.setOnLoadCallback(drawChart1);
      var qq = get_hourly_count_visitors_by_dwell_level_today();
      var time = ['12am-1am', '1am-2am', '2am-3am', '3am-4am', '4am-5am', '5am-6am', '6am-7am', '7am-8am', '8am-9am', '9am-10am', '10am-11am', '11am-12pm', '12pm-1pm', '1pm-2pm', '2pm-3pm', '3pm-4pm', '4pm-5pm', '5pm-6pm', '6pm-7pm', '7pm-8pm', '8pm-9pm', '9pm-10pm', '10pm-11pm', '11pm-12am'];
      var multiarr = new Array(qq.length + 1);
      for (var i = 0; i < (qq.length + 1); i++) {
        if (i == 0) {
          multiarr[i] = new Array(6);
          multiarr[i] = ['time', '5-30 mins', '30-60 mins', '1-5 hours', '5-8 hours', '8+ hours'];
        }
        else {
          multiarr[i] = new Array(6);
          multiarr[i][0] = time[i - 1];
          multiarr[i][1] = qq[i - 1].FIVE_TO_THIRTY_MINUTES;
          multiarr[i][2] = qq[i - 1].THIRTY_TO_SIXTY_MINUTES;
          multiarr[i][3] = qq[i - 1].ONE_TO_FIVE_HOURS;
          multiarr[i][4] = qq[i - 1].FIVE_TO_EIGHT_HOURS;
          multiarr[i][5] = qq[i - 1].EIGHT_PLUS_HOURS;
        }
      }
      function drawChart1() {
        var data = google.visualization.arrayToDataTable(multiarr);

          var options = {
            title: 'Dwell Time',
            curveType: 'function',
            legend: {position: 'bottom'}
          };
          if (document.location.href.indexOf('analytics.html') != -1) {
            var chart = new google.visualization.LineChart(document.getElementById("dwelltime"));
            chart.draw(data, options);
          }
      }
      google.charts.setOnLoadCallback(drawChart2);
      var qq1 = get_hourly_count_repeat_visitors_for_day();
      var repeat = new Array(qq1.length + 1);
      for (var i = 0; i < (qq1.length + 1); i++) {
        if (i == 0) {
          repeat[i] = new Array(6);
          repeat[i] = ['time', 'daily', 'weekly', 'occasional', 'first time', 'yesterday'];
        }
        else {
          repeat[i] = new Array(6);
          repeat[i][0] = time[i - 1];
          repeat[i][1] = qq1[i - 1].daily;
          repeat[i][2] = qq1[i - 1].weekly;
          repeat[i][3] = qq1[i - 1].occasional;
          repeat[i][4] = qq1[i - 1].first_time;
          repeat[i][5] = qq1[i - 1].yesterday;
        }
      }
      function drawChart2() {
        var data = google.visualization.arrayToDataTable(repeat);

        var options = {
          title: 'Repeat Visitors',
          curveType: 'function',
          legend: {position: 'bottom'}
        };
        if (document.location.href.indexOf('analytics.html') != -1) {
          var chart = new google.visualization.LineChart(document.getElementById("repeat"));
          chart.draw(data, options);
        }
      }
      google.charts.setOnLoadCallback(drawChart3);
      var end, start;
      var now = new Date();
      end = (now.toISOString()).substring(0, 10);
      var past = new Date();
      past.setDate(past.getDate() - 30);
      start = (past.toISOString()).substring(0, 10);
      qq2 = get_daily_count_repeat_visitors(start, end);
      var stat = new Array(qq2.length + 1);
      for (var i = 0; i < (qq2.length + 1); i++) {
        if (i == 0) {
          stat[i] = new Array(3);
          stat[i] = ['date', 'regular visitors', 'irregular visitors'];
        }
        else {
          stat[i] = new Array(3);
          stat[i][0] = qq2[i - 1].date;
          stat[i][1] = qq2[i - 1].daily + qq2[i - 1].weekly;
          stat[i][2] = qq2[i - 1].occasional + qq2[i - 1].first_time;
        }
      }
      function drawChart3() {
        var data = google.visualization.arrayToDataTable(stat);

        var options = {
          title: 'Statistics for the month',
          seriesType: 'bars',
          series: {31: {type: 'line'}}
        };
        if (document.location.href.indexOf('statistics.html') != -1) {
          var chart = new google.visualization.ComboChart(document.getElementById("stat"));
          chart.draw(data, options);
        }
      }

      google.charts.setOnLoadCallback(drawChart6);
        var now = new Date();
        var end = (now.toISOString()).substring(0, 10);
        var tty = get_daily_count_repeat_visitors('2017-12-27', end);
        var days = new Array(8);
        var j = 3;
        days[0] = new Array(2);
        days[0][0] = 'Day of week';
        days[0][1] = 'Average number of visitors';
        var week = [0, 0, 0, 0, 0, 0, 0];
        var max = 0;
        var attendance;
        var k = 0;
        for (var i = 0; i < tty.length; i++) {
         if (j % 7 === 0) {
           week[0] = week[0] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 1) {
            week[1] = week[1] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 2) {
            week[2] = week[2] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 3) {
            week[3] = week[3] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 4) {
            week[4] = week[4] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 5) {
           week[5] = week[5] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          else if (j % 7 === 6) {
           week[6] = week[6] + tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
          }
          if (max <= (tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional)) {
           max = tty[i].daily + tty[i].weekly + tty[i].first_time + tty[i].occasional;
           attendance = tty[i].date;
          }
          j++;
        }
        days[1] = new Array(2);
        days[1][0] = 'Sunday';
        days[1][1] = parseInt(week[0] / (i / 7));
        days[2] = new Array(2);
        days[2][0] = 'Monday';
        days[2][1] = parseInt(week[1] / (i / 7));
        days[3] = new Array(2);
        days[3][0] = 'Tuesday';
        days[3][1] = parseInt(week[2] / (i / 7));
        days[4] = new Array(2);
        days[4][0] = 'Wednesday';
        days[4][1] = parseInt(week[3] / (i / 7));
        days[5] = new Array(2);
        days[5][0] = 'Thursday';
        days[5][1] = parseInt(week[4] / (i / 7));
        days[6] = new Array(2);
        days[6][0] = 'Friday';
        days[6][1] = parseInt(week[5] / (i / 7));
        days[7] = new Array(2);
        days[7][0] = 'Saturday';
        days[7][1] = parseInt(week[6] / (i / 7));
        var temp = new Array(2);
        temp = [undefined, 0];
        for (var i = 1; i < 8; i++) {
          if (days[i][1] > temp[1]) {
            temp[0] = days[i][0];
            temp[1] = days[i][1];
          }
        }
        function drawChart6() {
          var data = google.visualization.arrayToDataTable(days);
          var options = {
            title: 'Correlation between day of the week and number of visitors',
            seriesType: 'bars',
            series: {7: {type: 'line'}}
          };
          if (document.location.href.indexOf('statistics.html') != -1) {
            var chart = new google.visualization.ComboChart(document.getElementById("bestdays"));
            chart.draw(data, options);
          }
        }
google.charts.setOnLoadCallback(drawChart7);
var f1, f2, f3;
    f1 = get_online_phones_by_floor(1);
    f2 = get_online_phones_by_floor(2);
    f3 = get_online_phones_by_floor(3);
    var man = new Array(f1.length + f2.length + f3.length);
    for (var i = 0; i < man.length; i++) {
      if (i < f1.length) {
        man[i] = f1[i];
      }
      else if (i < f1.length + f2.length) {
        man[i] = f2[i - f1.length];
      }
      else if (i < f1.length + f2.length + f3.length) {
        man[i] = f3[i - f1.length - f2.length];
      }
    }
    man = man.sort();
    var f = 0;
    var k = 1;
    var phone = new Array();
    phone[0] = new Array(2);
    phone[0][0] = 'Manufacturer';
    phone[0][1] = 'Quantity';
    var tmpphone = new Array(2);
    tmpphone[0] = undefined;
    tmpphone[1] = 0;
    while (f < man.length) {
      if (man[f] == null) {
        break;
      }
      phone[k] = new Array(2);
      phone[k][0] = man[f];
      phone[k][1] = 0;
      var buf = man[f];
      while (buf == man[f]) {
        phone[k][1] += 1;
        f++;
      }
      if (tmpphone[1] < phone[k][1]) {
        tmpphone[0] = phone[k][0];
        tmpphone[1] = phone[k][1];
      }
      k++;
    }
    var phone = phone.sort(function compareFunc(a, b) {
      return (b[1] - a[1]);
    });

    function drawChart7() {
      var data = google.visualization.arrayToDataTable(phone);
      var options = {
        title: 'Correlation between visitors and device manufacturers (except ' + (man.length - f) + ' unknown devices)',
        is3D: true,
      };
      if (document.location.href.indexOf('statistics.html') != -1) {
        var chart = new google.visualization.PieChart(document.getElementById('phones'));
        chart.draw(data, options);
      }
    }
      google.charts.setOnLoadCallback(drawChart8);
      var qwe = get_daily_average_visitor_dwell_time_by_dwell_level('2017-12-24');
      var avedwell = new Array(8);
      avedwell[0] = new Array(6);
      var j = 0;
      for (var i = 1; i < 8; i++) {
        avedwell[i] = new Array(6);
        avedwell[i][0] = undefined;
        avedwell[i][1] = 0;
        avedwell[i][2] = 0;
        avedwell[i][3] = 0;
        avedwell[i][4] = 0;
        avedwell[i][5] = 0;
      }
      avedwell[0] = ['day', '5-30 mins', '30-60 mins', '1-5 hours', '5-8 hours', '8+ hours'];
      for (var i = 0; i < qwe.length; i++) {
        if (j % 7 == 0) {
            avedwell[1][0] = 'Sunday';
            avedwell[1][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
            avedwell[1][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
            avedwell[1][3] += qwe[i].ONE_TO_FIVE_HOURS;
            avedwell[1][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
            avedwell[1][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 1) {
          avedwell[2][0] = 'Monday';
          avedwell[2][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[2][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[2][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[2][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[2][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 2) {
          avedwell[3][0] = 'Tuesday';
          avedwell[3][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[3][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[3][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[3][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[3][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 3) {
          avedwell[4][0] = 'Wednesday';
          avedwell[4][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[4][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[4][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[4][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[4][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 4) {
          avedwell[5][0] = 'Thursday';
          avedwell[5][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[5][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[5][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[5][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[5][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 5) {
          avedwell[6][0] = 'Friday';
          avedwell[6][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[6][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[6][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[6][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[6][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        else if (j % 7 == 6) {
          avedwell[7][0] = 'Saturday';
          avedwell[7][1] += qwe[i].FIVE_TO_THIRTY_MINUTES;
          avedwell[7][2] += qwe[i].THIRTY_TO_SIXTY_MINUTES;
          avedwell[7][3] += qwe[i].ONE_TO_FIVE_HOURS;
          avedwell[7][4] += qwe[i].FIVE_TO_EIGHT_HOURS;
          avedwell[7][5] += qwe[i].EIGHT_PLUS_HOURS;
        }
        j++;
      }
      for (var i = 1; i < 8; i++) {
        for (var k = 1; k < 6; k++) {
          avedwell[i][k] = avedwell[i][k] / j;
        }
      }
      //console.log(avedwell);
      function drawChart8() {
          var data = google.visualization.arrayToDataTable(avedwell);
          var options = {
            title: 'Correlation between day of the week and dwelltime',
            seriesType: 'bars',
            series: {7: {type: 'line'}}
          };
          if (document.location.href.indexOf('statistics.html') != -1) {
            var chart = new google.visualization.ComboChart(document.getElementById("bestdwell"));
            chart.draw(data, options);
          }
        }
      google.charts.load('current', {'packages':['table']});
      google.charts.setOnLoadCallback(drawChart4);
      function drawChart4() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Index');
        data.addColumn('string', 'Value');
        data.addRows([
          ['Number of currently connected visitors', sum.toString()],
          ['Sum of connected visitors (3 days)', get_sum_connected_visitors_count_3_days().toString()],
          ['Sum of connected visitors (7 days)', get_sum_connected_visitors_count_7_days().toString()],
          ['Sum of connected visitors (30 days)', get_sum_connected_visitors_count_30_days().toString()],
          ['The highest attendance ever registered', max.toString() + " visitors (" + attendance + ")"],
          ['The most popular day of the week', temp[0]],
          ['The most popular device maker (now)', tmpphone[0] + " (" + tmpphone[1] + " devices)"]
          ]);
        if (document.location.href.indexOf('analytics.html') != -1) {
          var table = new google.visualization.Table(document.getElementById("sum"));
          table.draw(data, {showRowNumber: false, width: "750px"});
        }
      }
      google.charts.setOnLoadCallback(drawChart5);
      var qq3 = get_average_visitors_count_by_day_of_week();
      var forecast = new Array(qq3.length + 1);
      for (var i = 0; i < qq3.length + 1; i++) {
        if (i == 0) {
          forecast[i] = new Array(2);
          forecast[i][0] = 'date';
          forecast[i][1] = 'visitors';
        }
        else {
          forecast[i] = new Array(2);
          forecast[i][0] = qq3[i - 1].date;
          forecast[i][1] = qq3[i - 1].value;
          if (i == 1) {
            forecast[i][0] = 'Tomorrow';
          }
        }
      }
      function drawChart5() {
        var data = google.visualization.arrayToDataTable(forecast);
        var options = {
          title: 'Forecasting number of visitors (7 days)',
          seriesType: 'bars',
          series: {7: {type: 'line'}}
        };
        if (document.location.href.indexOf('statistics.html') != -1) {
          var chart = new google.visualization.ComboChart(document.getElementById("forecast"));
          chart.draw(data, options);
        }
      }

  });

  $(document).ready(function getinf1(){
    var start = 0;
    var end = 0;
    var s;
    var str = window.location.href;
    for (var i = 0; i < str.length; i++) {
      if (str[i] == "=") {
        start = i + 1;
        break ;
      }
    }
    for (var i = start; i < str.length; i++) {
      if (str[i] == "?") {
        end = i;
        break ;
      }
    }
    var login = str.substring(start, end);
    for (var i = end; i < str.length; i++) {
      if (str[i] == "=") {
        start = i + 1;
        break ;
      }
    }
    for (var i = start; i < str.length; i++) {
      end = i + 1;
    }
    var macaddr = str.substring(start, end);
    var g = 1;
    if (macaddr == "") {
      s = 10;
    }
    else {
      for (var g = 1; g <= 3; g++) {
          var users = get_online_users_by_floor(g);
          for (var i = 0; i < users.length; i++) {
            if (users[i].mac.toString() == macaddr) {
                s = g;
                break ;
            }
          }
      }
    }
    if (login.length < 1) {
      s = 10;
    }
    if (login.toString() === "Guest" && macaddr === "Guest") {
      s = 33;
    }
    switch (s) {
      case 10:
        window.open("index.html", "_self");
        break ;
      case 1:
        document.getElementById("happy").innerHTML = "Hi, " + login.toString() + "! We are glad to see you on the first floor!";
        break ;
      case 2:
        document.getElementById("happy").innerHTML = "Hi, " + login.toString() + "! We are glad to see you on the second floor!";
        break ;
      case 3:
        document.getElementById("happy").innerHTML = "Hi, " + login.toString() + "! We are glad to see you on the third floor!";
        break ;
      case 33:
        document.getElementById("happy").innerHTML = "You entered as anonymous.";
        break ;
      default:
        window.open("index.html", "_self");
    }
    document.getElementById("l1").setAttribute('href', 'map1.html?login=' + login.toString() + '?macaddr=' + macaddr);
    document.getElementById("l2").setAttribute('href', 'map2.html?login=' + login.toString() + '?macaddr=' + macaddr);
    document.getElementById("l3").setAttribute('href', 'map3.html?login=' + login.toString() + '?macaddr=' + macaddr);
    document.getElementById("l4").setAttribute('href', 'statistics.html?login=' + login.toString() + '?macaddr=' + macaddr);
    document.getElementById("l5").setAttribute('href', 'analytics.html?login=' + login.toString() + '?macaddr=' + macaddr);
  });

function byebye() {
  if (confirm("Are you sure?")) {
    window.open("index.html", "_self");
  }
}