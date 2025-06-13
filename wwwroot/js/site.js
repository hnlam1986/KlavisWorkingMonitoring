// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var connection = new signalR.HubConnectionBuilder().withUrl("/monitoring").build();

//Disable the send button until connection is established.
//document.getElementById("sendButton").disabled = true;
function AjaxPost(actionUrl, successCallback, postData) {
    $.ajax({
        type: "POST",
        url: actionUrl,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(postData),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
        },
        success: function (result) {
            if (successCallback != null) {
                successCallback(result);
            }
        },
        error: function (result, status) {
            console.log(result);
        }
    });
}
function AjaxGet(url, successCallBack) {
    $.ajax({
        type: "GET",
        url: url,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'content-type');
            xhr.setRequestHeader('Access-Control-Max-Age', '1800');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
            xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
        },
        success: function (result, status) {
            successCallBack(result)
        },
        error: function (result, status) {
            console.log(result);
        }
    });
}
function StatusInString(status) {
    switch (status) {
        case 0:
        case 'ON':
            return '<i class="bi bi-circle-fill online" data-timer="0"></i><span class="counter">0s</span>';
        case 1:
        case 'OFF':
            return '<i class="bi bi-circle-fill offline" data-timer="0"></i><span class="counter">0s</span>';
        case 2:
        case 'INPRO':
            return '<i class="bi bi-circle-fill inprocess" data-timer="0"></i><span class="counter">0s</span>';
        case 3:
        case 'IDLE':
            return '<i class="bi bi-circle-fill idle" data-timer="0"></i><span class="counter">0s</span>';
        case 4:
        case 'DIS':
            return '<i class="bi bi-circle-fill disconnect" data-timer="0"></i><span class="counter">0s</span>';
        case 5:
            case 'CON':
        case 'Connected':
            return '<i class="bi bi-circle-fill connect" data-timer="0"></i><span class="counter">0s</span>';
    }
}

connection.on("ReceiveMessage", function (user, message) {
    if (user == "all") {
        $("table tbody").html("");
        if (message) {
            for (var i = 0; i < message.length; i++) {
                var obj = message[i];
                var html = "<tr id='" + obj.userId + "'>";
                html += "<td name='id'>" + obj.userId + "</td>";
                html += "<td name='status'>" + StatusInString(obj.currentStatus) + "</td>";
                html += "<td name='wt'>" + SecondToTime(obj.totalWorkingTime) + "</td>";
                html += "<td name='inprocess'>" + SecondToTime(obj.totalInProcess) + "</td>";
                html += "<td name='idle'>" + SecondToTime(obj.totalIdle) + "</td>";
                html += "<td name='on'>" + SecondToTime(obj.totalOnline) + "</td>";
                html += "<td name='off'>" + SecondToTime(obj.totalOffline) + "</td>";
                html += "<td name='version'>" + obj.version + "</td>";
                html += "<td name='screeshot'><button type='button' onclick='TakeScreenShot(" + obj.userId +")'>Capture</button></td>";
                html += "</tr>";
                $("table tbody").append(html);
            }
        }
    } else {
        if (message.type == "NewUser") {
            var html = "<tr id='" + user + "'>";
            html += "<td name='id'>" + user + "</td>";
            html += "<td name='status'>" + StatusInString(message.content) + "</td>";
            html += "<td name='wt'>" + 0 + "</td>";
            html += "<td name='inprocess'>" + 0 + "</td>";
            html += "<td name='idle'>" + 0 + "</td>";
            html += "<td name='on'>" + 0 + "</td>";
            html += "<td name='off'>" + 0 + "</td>";
            html += "<td name='version'>" + 0 + "</td>";
            html += "<td name='screeshot'><button type='button' onclick='TakeScreenShot(" + user + ")'>Capture</button></td>";
            html += "</tr>";
            $("table tbody").append(html);
        }
        else if (message.type == "UpdateStatus") {
            var tr = $("table tbody tr[id=" + user + "]");
            if (tr) {
                var status = $(tr).find("td[name=status]");
                if (status) {
                    var htmlclass = "";
                    switch (message.content.currentStatus) {
                        case 2:
                            htmlclass = "inprocess";
                            break;
                        case 0:
                            htmlclass = "online";
                            break;
                        case 1:
                            htmlclass = "offline";
                            break;
                        case 3:
                            htmlclass = "idle";
                            break;
                        case 4:
                            htmlclass = "disconnect";
                            break;
                        case 5:
                            htmlclass = "connect";
                            break;
                    }
                    var li = $(status).find("i." + htmlclass)
                    if (li == undefined || li.length == 0) {
                        $(status).html(StatusInString(message.content.currentStatus));
                    }
                }
                $wt = $(tr).find("td[name=wt]");
                $inprocess = $(tr).find("td[name=inprocess]");
                $idle = $(tr).find("td[name=idle]");
                $on = $(tr).find("td[name=on]");
                $off = $(tr).find("td[name=off]");
                $version = $(tr).find("td[name=version]");
                if ($wt.length > 0) {
                    $wt.text(SecondToTime(message.content.totalWorkingTime))
                }
                if ($inprocess.length > 0) {
                    $inprocess.text(SecondToTime(message.content.totalInProcess))
                }
                if ($idle.length > 0) {
                    $idle.text(SecondToTime(message.content.totalIdle))
                }
                if ($on.length > 0) {
                    $on.text(SecondToTime(message.content.totalOnline))
                }
                if ($off.length > 0) {
                    $off.text(SecondToTime(message.content.totalOffline))
                }
                if ($version.length > 0) {
                    $version.text(message.content.version)
                }
            }
        }
    }
});
connection.on("ReceiveScreenShot", function (user, message) {
    const screenshotImage = new Image();
    var tick = Date.now()
    screenshotImage.src = "/images/screenshot.jpg?t=" + tick;
    $("#exampleModal .modal-body").html(screenshotImage)
    //$("#exampleModal").show();
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
    myModal.show();
});
var adminId = "";
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$(document).ready(function () {
    var cookieValue = getCookie("adminId");
    if (cookieValue) {
        $("#adminId").val(cookieValue);
        adminId = "admin" + cookieValue;
        $("#adminId").prop("disabled", true)
        $("#btnConnect").prop("disabled", true)
        ConnectSignalR();
    }
});
function ConnectSignalR() {
    $(document).ready(function () {
        adminId ="admin"+ $("#adminId").val();
        if (adminId != "") {
            setCookie("adminId", $("#adminId").val(),1)
            connection.start().then(function () {
                //document.getElementById("sendButton").disabled = false;
                console.log("start");
                $("#adminId").prop("disabled", true)
                $("#btnConnect").prop("disabled", true)
                connection.invoke("SendMessage", adminId, { Type: "connecting", Content: "get all user" }).catch(function (err) {
                    return console.error(err.toString());
                });

            }).catch(function (err) {
                return console.error(err.toString());
            });
        } else {
            alert("Id không được để trống");
        }
    })
    
}
function CheckAlive() {
    connection.invoke("CheckAlive", adminId, "check").catch(function (err) {
        return console.error(err.toString());
    });
}
//var checkAlive = setInterval(function () {
//    connection.invoke("CheckAlive", "admin", "check").catch(function (err) {
//        return console.error(err.toString());
//    });
//},30000)
var counting = setInterval(function () {
    $(".bi-circle-fill").each(function () {
        var item = this;
        var counter = $(item).attr("data-timer");
        var value = parseInt(counter) + 1;
        $(item).attr("data-timer", value);
        $($(item).closest("td")).find("span").text(SecondToTime(value));
    })
}, 1000)
function SecondToTime(s) {
    if (s > 0) {
        let seconds = s.toFixed(1);
        let minutes = (s / (60)).toFixed(1);
        let hours = (s / (60 * 60)).toFixed(1);
        let days = (s / (60 * 60 * 24)).toFixed(1);
        if (seconds < 60) return seconds + "s";
        else if (minutes < 60) return minutes + "m";
        else if (hours < 24) return hours + "h";
        else return days + " Days"
    }
    return "0s";
}
function TakeScreenShot(id) {
    if (connection && connection._connectionState == "Connected") {
        connection.invoke("SendMessage", adminId, { Type: "TakeScreenShot", Content: id });
    }
}
function BuildStepScheduleItem(step) {
    var item = '<div class="list-group-item list-group-item-action" id="step-schedule-item-' + step.idStepSchedule + '" data-id="' + step.idStepSchedule + '" data-sorting="' + step.orderNum + '"> ' +
        '<div class="row" >' +
        '<div class="col col-10">' +
        '<div class="d-flex w-100 justify-content-between">' +
        '<h5 class="mb-1">' + step.description + '</h5>' +
        '</div>' +
        '<p class="mb-1">' + step.percentRatio + '%</p>' +
        '</div>' +
        '<div class="col col-2">' +
        '<button class="vertical-center btn btn-warning btn-list-edit" onclick="EditScheduleStepItem(' + step.idStepSchedule + ')"><i class="bi bi-pencil"></i></button>' +
        '<button class="vertical-center btn btn-danger btn-list-del" onclick="DeleteScheduleStepItem(' + step.idStepSchedule + ')"><i class="bi bi-trash"></i></button>'
    '</div>' +
        '</div>'
    return item;
}
function BuildStepScheduleItemWithoutButton(step) {
    var item = '<div class="list-group-item list-group-item-action" id="step-schedule-item-' + step.idStepSchedule + '" data-id="' + step.idStepSchedule + '" data-sorting="' + step.orderNum + '"> ' +
        '<div class="row" >' +
        '<div class="col col-12">' +
        '<div class="d-flex w-100 justify-content-between">' +
        '<h5 class="mb-1">' + step.description + '</h5>' +
        '<p class="mb-1">' + step.percentRatio + '%</p>' +
        '</div>' +
        
        '</div>' +
        '<div class="col col-2">' +
        
    '</div>' +
        '</div>'
    return item;
}
