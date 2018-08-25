url_cmx = "https://cisco-cmx.unit.ua";
username_cmx = "RO";
password_cmx = "just4reading";

url_presence = "https://cisco-presence.unit.ua";
username_presence = "RO";
password_presence = "Passw0rd";

aesUId = '';

function handle_errors(e) {
    localStorage.setItem(e.name, e.message);
}

function get_info(e) {
    localStorage.getItem(e.name);
}

function get_aesUId() {
    if (aesUId !== '') return aesUId;
    var res = '';
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/config/v1/sites",
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            res = responce[0].aesUidString;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    aesUId = res;
    return res;
}

function get_all_online_users() {
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
            console.log('size ' + responce.length);
            responce.forEach(function (t) {
                var user = {};
                user.name = t.userName;
                user.x = t.mapCoordinate.x;
                user.y = t.mapCoordinate.y;
                user.mac = t.macAddress;
                res.push(user);
            });
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_online_users_by_floor(floor) {
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
                    var user = {};
                    user.name = t.userName;
                    user.x = t.mapCoordinate.x;
                    user.y = t.mapCoordinate.y;
                    user.mac = t.macAddress;
                    res.push(user);
                }
            });
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_all_users_count() {
    var count = 0;
    $.ajax
    ({
        type: "GET",
        url: url_cmx + "/api/location/v2/clients/count",
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(username_cmx + ":" + password_cmx)
        },
        success: function (responce){
            count = responce.count;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return count;
}

function get_daily_count_passersby_lastmonth() {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/passerby/daily/lastmonth",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t) {
                var a = {};
                a.date = t;
                a.value = responce[t];
                res.push(a);
            });
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_sum_connected_visitors_count_3_days() {
    var res;
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/total/3days",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            res = responce;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_sum_connected_visitors_count_7_days() {
    var res;
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/total/lastweek",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            res = responce;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_sum_connected_visitors_count_30_days() {
    var res;
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/total/lastmonth",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            res = responce;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_daily_count_repeat_visitors(startDate, endDate) {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/repeatvisitors/daily",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId(),
            startDate: startDate,
            endDate: endDate
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t) {
                var a = {};
                a.date = t;
                temp = responce[t];
                a.daily = temp['DAILY'];
                a.weekly = temp['WEEKLY'];
                a.occasional = temp['OCCASIONAL'];
                a.first_time = temp['FIRST_TIME'];
                a.yesterday = temp.YESTERDAY;
                res.push(a);
            })
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_hourly_count_repeat_visitors_for_day(date) {
    var res = [];
    if (!date) {
        date = moment().format('YYYY-MM-DD');
    }
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/repeatvisitors/hourly",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId(),
            date: date
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t) {
                var a = {};
                a.time = parseInt(t);
                temp = responce[t];
                a.daily = temp['DAILY'];
                a.weekly = temp['WEEKLY'];
                a.occasional = temp['OCCASIONAL'];
                a.first_time = temp['FIRST_TIME'];
                a.yesterday = temp.YESTERDAY;
                res.push(a);
            })
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_hourly_count_visitors_by_dwell_level_today() {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/dwell/hourly/today",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t) {
                var a = {};
                a.time = parseInt(t);
                temp = responce[t];
                a.FIVE_TO_THIRTY_MINUTES = temp['FIVE_TO_THIRTY_MINUTES'];
                a.THIRTY_TO_SIXTY_MINUTES = temp['THIRTY_TO_SIXTY_MINUTES'];
                a.ONE_TO_FIVE_HOURS = temp['ONE_TO_FIVE_HOURS'];
                a.FIVE_TO_EIGHT_HOURS = temp['FIVE_TO_EIGHT_HOURS'];
                a.EIGHT_PLUS_HOURS = temp['EIGHT_PLUS_HOURS'];
                res.push(a);
            })
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_average_count_connected_visitors_last_30_days() {
    var res;
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/count/lastmonth",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            res = responce;
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_forecasting_number_of_visitors() {
    var res;
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/count/lastmonth",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId()
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){

        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_last_10_day_of_week() {
    var res = [];
    for(i = 1; i < 10; i++){
        var d = new Date();
        d.setDate(d.getDate() - 7 * i);
        res.push(d);
    }
    return res;
}

function get_previous_70_days() {
    var date = new Date();
    var res = [];
    for(var i = 1; i <= 70; i++){
        res.push(moment(new Date().setDate(date.getDate() - i)).format('YYYY-MM-DD'));
    }
    return res;
}

function get_visitors_by_last_70_days() {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/connected/daily",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId(),
            startDate: moment().subtract(70, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t){
                var temp = {};
                temp.date = t;
                temp.value = responce[t];
                res.push(temp);
            })
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}

function get_average_visitors_count_by_day_of_week() {
    var res = [];
    var counts = new Array(7);
    for (var i = 0; i < counts.length; i++){
        counts[i] = 0;
    }
    var data = get_visitors_by_last_70_days();
    for (var j = 0; j < data.length; j++){
        counts[j % 7] += data[j].value;
    }
    for (var k = 0; k < counts.length; k++){
        counts[k] /= 10;
    }
    counts.push(counts[0]);
    counts.splice(0, 1);
    for(var l = 0; l < counts.length; l++){
        var obj = {};
        obj.date = moment().add(l + 1, 'days').format('YYYY-MM-DD');
        obj.value = counts[l];
        res.push(obj);
    }
    return res;
}

function get_daily_average_visitor_dwell_time_by_dwell_level(dateFrom) {
    var res = [];
    $.ajax
    ({
        type: "GET",
        url: url_presence + "/api/presence/v1/dwell/dailyaverage",
        dataType: 'json',
        async: false,
        data:{
            siteId: get_aesUId(),
            startDate: dateFrom,
            endDate: moment().format('YYYY-MM-DD')
        },
        headers: {
            "Authorization": "Basic " + btoa(username_presence + ":" + password_presence)
        },
        success: function (responce){
            Object.keys(responce).forEach(function (t) {
                var a = {};
                a.date = t;
                responce[t]['FIVE_TO_THIRTY_MINUTES'] ? a.FIVE_TO_THIRTY_MINUTES = responce[t]['FIVE_TO_THIRTY_MINUTES'] : a.FIVE_TO_THIRTY_MINUTES = 0;
                responce[t]['THIRTY_TO_SIXTY_MINUTES'] ? a.THIRTY_TO_SIXTY_MINUTES = responce[t]['THIRTY_TO_SIXTY_MINUTES'] : a.THIRTY_TO_SIXTY_MINUTES = 0;
                responce[t]['ONE_TO_FIVE_HOURS'] ? a.ONE_TO_FIVE_HOURS = responce[t]['ONE_TO_FIVE_HOURS'] : a.ONE_TO_FIVE_HOURS = 0;
                responce[t]['FIVE_TO_EIGHT_HOURS'] ? a.FIVE_TO_EIGHT_HOURS = responce[t]['FIVE_TO_EIGHT_HOURS'] : a.FIVE_TO_EIGHT_HOURS = 0;
                responce[t]['EIGHT_PLUS_HOURS'] ? a.EIGHT_PLUS_HOURS = responce[t]['EIGHT_PLUS_HOURS'] : a.EIGHT_PLUS_HOURS = 0;
                res.push(a);
            })
        },
        error: function (e) {
            handle_errors(e);
        }
    });
    return res;
}
