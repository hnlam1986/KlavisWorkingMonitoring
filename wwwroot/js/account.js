var _listAccountSetting = []
var _selectedAccountSetting = {};
var _listSteps=[]
var _listSchedule = []
function InitAccountPage() {
    AjaxGet("api/schedule/getsteps", function (data) {_listSteps = data;});
    AjaxGet("api/schedule/getschedules", function (data) {
        _listSchedule = data;
        var ddList = ""
        $(_listSchedule).each(function () {
            var item = '<option value=' + this.idSchedule + '>' + this.description + '</option>'
            ddList += item;
        })
        $(ddlSchedule).append(ddList);
        $(ddlSchedule).val(0);
    });
    GetAccountSetting();
}
function GetScheduleById(id) {
    for (var i = 0; i < _listSchedule.length; i++) {
        if (_listSchedule[i].idSchedule == id) {
            return _listSchedule[i];
        }
    }
    return {};
}
function ShowStepInSchedule() {
    var idSchedule = $("#ddlSchedule option:selected").val();
    var selected = GetScheduleById(idSchedule);
    var steps = selected.steps;
    var html = "";
    $(".list-shedule-step").html("");
    var header = '<div class="list-group-item list-group-item-action disabled">' +
        '<div class="d-flex w-100 justify-content-between">' +
        '<h5 class="mb-1">Schedule step</h5>' +
        '</div>' +
        '</div>'
    $(".list-shedule-step").append(header);
    $(steps).each(function (index) {
        this.orderNum = index + 1;
        var item = BuildStepScheduleItemWithoutButton(this);
        $(".list-shedule-step").append(item);
    })
}
function GetAccountSetting(callback) {
    AjaxGet("api/KlavisAccount/GetKlavisAccount", function (data) {
        _listAccountSetting = data;
        var list = '';
        $(data).each(function () {
            //var item = '<button class="list-group-item list-group-item-action" onclick="SelectKlavisAccount(this,' + this.idklavisaccount +')" data-idklavisaccount="' + this.idklavisaccount +'">' + this.klavisid + '</button>'
            var item = BuildAccountItem(this);
            list = list + item;
        })
        $("#listAccount").html("");
        $("#listAccount").append(list);
        if (callback) {
            callback();
        }
    })

}
function BuildAccountItem(account) {
    var item = '<div class="list-group-item list-group-item-action" id="account-item-' + account.idklavisaccount + '" data-id="' + account.idklavisaccount + '" > ' +
                    '<div class="row" >' +
                        '<div class="col clickable" onclick="SelectKlavisAccount(this,' + account.idklavisaccount +')">' +
                            '<div class="d-flex w-100 justify-content-between">' +
                                '<h5 class="mb-1">' + account.klavisid + '</h5>' +
                            '</div>' +
                            '<p class="mb-1 truncate">' + account.userlogin + '</p>' +
                            '<button class="vertical-center btn btn-warning btn-list-edit" onclick="EditAccountItem(' + account.idklavisaccount + ')"><i class="bi bi-pencil"></i></button>' +
                            '<button class="vertical-center btn btn-danger btn-list-del" onclick="DeleteAccountItem(' + account.idklavisaccount + ')"><i class="bi bi-trash"></i></button>'+
                        '</div>' +
                    '</div>' +
                '</div>'
    return item;
}
var _beforePriorityStep = [];
function SelectKlavisAccount(btn, idklavisaccount) {
    $("#listAccount .list-group-item").removeClass("selected");
    $(btn).closest(".list-group-item").addClass("selected");
    var selected = GetAccountSettingById(idklavisaccount);
    _selectedAccountSetting = selected;
    if (selected.flowsetting ==1) {
        $(rdPriority).prop('checked', true);
    } else if (selected.flowsetting == 2) {
        $(rdScheduleStep).prop('checked', true);
    } else {
        $(rdNoApply).prop('checked', true);
    }
    _beforePriorityStep = selected.steppriority;
    BuildListStepPriority(selected.steppriority);
    $(ddlSchedule).val(selected.idschedule);
    ShowStepInSchedule();
}
function EditAccountItem(id) {
    var selected = GetAccountSettingById(id);
    _selectedAccountSetting = selected;
    $(txtKlavisId).val(selected.klavisid);
    $(txtLoginName).val(selected.userlogin);
}
function DeleteAccountItem(id) {
    _selectedAccountSetting = GetAccountSettingById(id);
    ShowOkCancelDialog("Delete message", "Do you want to delete this account?", function () { SaveKlavisAccount(3, id); })
}
var _accountSaveMode
function SaveKlavisAccount(mode, id) {
    _accountSaveMode = mode;
    var txtKlavisId = $("#txtKlavisId").val();
    var txtLoginName = $("#txtLoginName").val();
    if (mode == 1) {
        _selectedAccountSetting = {};
        _selectedAccountSetting.klavisid = txtKlavisId;
        _selectedAccountSetting.userlogin = txtLoginName;

    } else if (mode == 2) {
        _selectedAccountSetting.klavisid = txtKlavisId;
        _selectedAccountSetting.userlogin = txtLoginName;

    } else {
        _selectedAccountSetting.idklavisaccount = id;
        _selectedAccountSetting.isdeleted = true;
    }
    AjaxPost("api/KlavisAccount/SaveKlavisAccount", function (res) {
        if (res > 0) {
            GetAccountSetting();
            $("#txtKlavisId").val("");
            $("#txtLoginName").val("");
            if (mode == 1) {
                ShowToastMessage("Create account " + _selectedAccountSetting.klavisid + ' is successful!');
            } else if (mode == 2) {
                ShowToastMessage("Update account " + _selectedAccountSetting.klavisid + ' is successful!');
            } else {
                ShowToastMessage("Delete account " + _selectedAccountSetting.klavisid + ' is successful!');
            }
        }
    }, _selectedAccountSetting)
}
function BuildListStepPriority(list) {
    var prepareList = []
    $(_listSteps).each(function () {
        this.ischecked = false;
        this.idsteppriority = undefined;
    })
    $(list).each(function () {
        for (var i = 0; i < _listSteps.length; i++) {
            if (_listSteps[i].idInputStep == this.idstep) {
                _listSteps[i].ischecked = true;
                _listSteps[i].idsteppriority = this.idsteppriority;
                break;
            }
        }
    })
    var html = '<li class="list-group-item list-group-item-action disabled list-group-header">Step priority</li >';
    $(_listSteps).each(function () {
        var checked = "";
        if (this.ischecked == true) {
            checked = "checked";
        }
        var item = '<li class="list-group-item">' +
            '<input class="form-check-input me-1" type="checkbox" id="chk-' + this.idInputStep + '" data-idsteppriority="' + (this.idsteppriority == undefined ? "" : this.idsteppriority) + '" data-idstep="' + this.idInputStep + '" ' + checked + '>' +
            '<label class="form-check-label" for="chk-' + this.idInputStep + '">' + this.description + '</label>' +
            '</li>'
        html = html + item;
    })
    $("#listPriorityStep").html("");
    $("#listPriorityStep").append(html);
}
function GetAccountSettingById(idklavisaccount) {
    var selected = {};
    for (var i = 0; i < _listAccountSetting.length; i++) {
        if (_listAccountSetting[i].idklavisaccount == idklavisaccount) {
            selected = _listAccountSetting[i];
            break;
        }
    }
    return selected;
}
function ApplyFlowSetting() {
    var flowsetting = 0;
    flowsetting = $('input[name="rdFlow"]:checked').val();
    if (flowsetting == undefined) {
        flowsetting = 0;
    }
    var idschedule = $(ddlSchedule).val();
    var priorityStep = GetPriorityCheckedList(_selectedAccountSetting.idklavisaccount)

    _selectedAccountSetting.flowsetting = flowsetting;
    _selectedAccountSetting.idschedule = idschedule;
    _selectedAccountSetting.steppriority = priorityStep;
    AjaxPost("api/KlavisAccount/SaveFlowSetting", function (res) {
        if (res > 0) {
            GetAccountSetting(function () {
                $("#account-item-" + _selectedAccountSetting.idklavisaccount + " .clickable").click();
            });
            ShowToastMessage("Apply flow for account: " + _selectedAccountSetting.klavisid + ' is successful!');
        }
    }, _selectedAccountSetting)
}
function GetPriorityCheckedList(idklavisaccount) {
    var checked = $(".list-priority-step .list-group-item input:checked");
    var list = []
    $(checked).each(function () {
        var item = {};
        item.idsteppriority = $(this).attr("data-idsteppriority") == ""? undefined: $(this).attr("data-idsteppriority");
        item.idstep = $(this).attr("data-idstep");
        item.idklavisaccount = idklavisaccount;
        list.push(item);
    })
    //so sanh 2 list
    var afterCheck = [];
    if (_beforePriorityStep) {
        for (var i = 0; i < _beforePriorityStep.length; i++) {
            var before = _beforePriorityStep[i];
            var exist = false;
            for (var j = 0; j < list.length; j++) {
                var after = list[j];
                if (before.idsteppriority == after.idsteppriority) {
                    exist = true;
                    break;
                }
            }
            if (exist == false) {
                before.ischecked = false;
                before.isdeleted = true;
                afterCheck.push(before);
            }
        }
    }

    for (var i = 0; i < list.length; i++) {
        var after = list[i];
        var exist = false;
        if (_beforePriorityStep) {
            for (var j = 0; j < _beforePriorityStep.length; j++) {
                var before = _beforePriorityStep[j];
                if (before.idsteppriority == after.idsteppriority) {
                    exist = true;
                    break;
                }
            };
        }
        if (exist == false) {
            afterCheck.push(after);
        }
    }
    return afterCheck;
}
function FlowModeCheckChange(mode) {
    if (mode == 0) {
        LockUnlockAllElementInContain('lock', '.list-priority-step li input');
        $(ddlSchedule).attr("disabled", true);
    } else if (mode == 1) {
        $(ddlSchedule).attr("disabled", true);
        LockUnlockAllElementInContain('unlock', '.list-priority-step li input');
    } else {
        $(ddlSchedule).attr("disabled", false);
        LockUnlockAllElementInContain('lock', '.list-priority-step li input');
    }
    
}
function LockUnlockAllElementInContain(mode, selector) {
    var child = $(selector);
    if (mode == 'lock') {
        $(child).each(function () {
            $(this).attr("disabled", true)
        })
    } else {
        $(child).each(function () {
            $(this).removeAttr("disabled")
        })
    }
}