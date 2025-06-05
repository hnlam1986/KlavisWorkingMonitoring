var _listSchedule = []
var _listStep = []
var _listScheduleStep=[]
function InitSchedulePage() {
 
    $("#ddlTeam").val(-1);
   
    GetListScheduleSteps();
}
function GetListScheduleSteps() {
    AjaxGet("api/schedule/getschedules", GetSchedule_Success);
    AjaxGet("api/schedule/getsteps", GetStep_Success);
}
function GetSchedule_Success(data) {
    _listSchedule = data;
    var html = '';
    $(data).each(function (index) {
        var item = BuildScheduleItem(this);
        $(".list-schedule").append(item);
    })
    
}
function BuildScheduleItem(schedule) {
    var item = '<div class="list-group-item list-group-item-action" aria-current="true" id="schedule-item-' + schedule.idSchedule +'">' +
        '<div class="row"  data-schedule-id="' + schedule.idSchedule + '">' +
        '<div class="col col-10" onclick="SelectScheduleItem(' + schedule.idSchedule + ')">' +
        '<div class="d-flex w-100 justify-content-between">' +
        '<h5 class="mb-1">' + schedule.description + '</h5>' +
        '</div>' +
        '<p class="mb-1">' + schedule.projectTeam + '</p>' +
        '</div>' +
        '<div class="col col-2">' +
        '<button class="vertical-center btn btn-warning btn-list-edit" onclick="EditScheduleItem(' + schedule.idSchedule + ')"><i class="bi bi-pencil"></i></button>' +
        '<button class="vertical-center btn btn-danger btn-list-del" onclick="DeleteScheduleItem(' + schedule.idSchedule + ')"><i class="bi bi-trash"></i></button>'
    '</div>' +
        '</div>' +
        '</div>'
    return item;
}
function GetStep_Success(data) {
    _listStep = data
    $(data).each(function (index) {
        $("#ddlStep").append('<option value="' + this.idInputStep + '">' + this.description + '</option>')
    });
    $("#ddlStep").val(-1);
}
function AddSelectedClassListGroup(groupSelector, itemSelector) {
    $(groupSelector + " .list-group-item").removeClass("selected");
    $(itemSelector).addClass("selected")
}
function SelectScheduleItem(id) {
    AddSelectedClassListGroup(".list-schedule", "#schedule-item-" + id)
    //$("#schedule-item-" + id).addClass("selected");
    var schedule = GetScheduleDataById(id)
    _scheduleItem = schedule;
    if (schedule) {
        _listScheduleStep = schedule.steps
        BuildListScheduleStep(schedule.steps)
    }
    //for (var i = 0; i < _listSchedule.length; i++) {
    //    var schedule = _listSchedule[i];
    //    if (schedule.idSchedule == id) {
    //        //$("#txtName").val(schedule.description);
    //        //$("#ddlTeam").val(schedule.idProjectTeam);
    //        _listScheduleStep = schedule.steps
    //        BuildListScheduleStep(schedule.steps)
    //        break;
    //    }
    //}  
}
function EditScheduleItem(id) {
    for (var i = 0; i < _listSchedule.length; i++) {
        var schedule = _listSchedule[i];
        if (schedule.idSchedule == id) {
            $("#txtName").val(schedule.description);
            $("#ddlTeam").val(schedule.idProjectTeam);
            //BuildListScheduleStep(schedule.steps)
            _scheduleItem = schedule;
           
            break;
        }
    }
}
function GetScheduleDataById(id) {
    var res = {};
    for (var i = 0; i < _listSchedule.length; i++) {
        var schedule = _listSchedule[i];
        if (schedule.idSchedule == id) {
            res = schedule;

            break;
        }
    }
    return res;
}
function UpdateScheduleArray(item) {
    for (var i = 0; i < _listSchedule.length; i++) {
        var schedule = _listSchedule[i];
        if (schedule.idSchedule == item.idSchedule) {
            schedule.description = item.description;
            schedule.idProjectTeam = item.idProjectTeam;
            schedule.projectTeam = item.projectTeam;
            break;
        }
    }
}
function UpdateScheduleItemUI(item) {
    var $sch = $("#schedule-item-" + item.idSchedule);
    $sch.find("h5").text(item.description);
    $sch.find("p").text(item.projectTeam);
}
function DeleteScheduleItem(id) {
    _scheduleItem = GetScheduleDataById(id);
    SaveSchedule(3,id);
}
function BuildStepScheduleItem(step) {
    var item = '<div class="list-group-item list-group-item-action" id="step-schedule-item-"' + step.idStepSchedule +'> ' +
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
function BuildListScheduleStep(data) {
    var html = "";
    $(".list-step").html("");
    var header = '<div class="list-group-item list-group-item-action disabled">'+
        '<div class="d-flex w-100 justify-content-between">' +
        '<h5 class="mb-1">Step Item</h5>' +
        '</div>' +
        '</div>'
    $(".list-step").append(header);
    $(data).each(function () {
        var item = BuildStepScheduleItem(this);
        $(".list-step").append(item);
    })
    Sortable.create(stepList, {
        animation: 300,
        draggable: '.list-group-item',
        handle: '.list-group-item',
        sort: true,
        filter: '.sortable-disabled',
        chosenClass: 'active'
    });
}
function EditScheduleStepItem(id) {
    for (var i = 0; i < _listScheduleStep.length; i++) {
        var step = _listScheduleStep[i];
        if (step.idStepSchedule == id) {
            $("#ddlStep").val(step.idInputStep);
            $("#txtPercent").val(step.percentRatio);
            
            //BuildListScheduleStep(schedule.steps)
            break;
        }
    }
}
function DeleteScheduleStepItem(id) {

}
var _scheduleItem = {}
var _scheduleSaveMode=0
var _stepScheduleSaveMode = 0
var _stepScheduleItem = {}
function SaveSchedule(mode,id) { //1:New 2:Update 3:Delete
    _scheduleSaveMode = mode;
    var desc = $("#txtName").val();
    var idTeam = $("#ddlTeam option:selected").val();
    var projectTeam = $("#ddlTeam option:selected").text();
    if (mode == 1) {
        _scheduleItem = {};
        _scheduleItem.isActive = true;
        _scheduleItem.isDeleted = false;
        _scheduleItem.description = desc;
        _scheduleItem.idProjectTeam = idTeam;
        _scheduleItem.projectTeam = projectTeam;
    } else if (mode == 2) {
        _scheduleItem.description = desc;
        _scheduleItem.idProjectTeam = idTeam;
        _scheduleItem.projectTeam = projectTeam;
        
    }
    else {
        _scheduleItem.idSchedule = id;
        _scheduleItem.isDeleted = true;
    }
    AjaxPost("api/schedule/SaveSchedule", SaveScheduleSuccess, _scheduleItem)
}
function SaveScheduleSuccess(res) {
    if (res > 0) {
        var item = {};
        item = _scheduleItem;
        item.idSchedule = res;
        var html = BuildScheduleItem(item);
        if (_scheduleSaveMode == 1) {
            //new schedule
            $(".list-schedule").append(html);
            _listSchedule.push(item);
        } else if (_scheduleSaveMode == 2) {
            //update schedule
            UpdateScheduleArray(item);
            UpdateScheduleItemUI(item);
        } else {
            //remove schedule
            $("#schedule-item-" + res).remove();
        }
    }
}

function SaveStepSchedule(mode, id) {
    _stepScheduleSaveMode = mode;
    var percent = $("#txtPercent").val();
    var idStep = $("#ddlStep option:selected").val();
    var stepName = $("#ddlStep option:selected").text();
    if (mode == 1) {
        _stepScheduleItem = {};
        _stepScheduleItem.idInputStep = idStep;
        _stepScheduleItem.description = stepName;
        _stepScheduleItem.idSchedule = _scheduleItem.idSchedule;
        _stepScheduleItem.percentRatio = percent;
        var itemCount = $("#stepList .list-group-item").length;
        _stepScheduleItem.orderNum = itemCount;
        _stepScheduleItem.isActive = true;
        _stepScheduleItem.isDeleted = false;

    }
    else if (mode == 2) {

    } else {

    }
    AjaxPost("api/schedule/SaveStepSchedule", SaveStepScheduleSuccess, _stepScheduleItem)
}
function SaveStepScheduleSuccess(res) {
    if (res > 0) {
        var item = {};
        item = _stepScheduleItem;
        item.idStepSchedule = res;
        var html = BuildStepScheduleItem(item);
        if (_stepScheduleSaveMode == 1) {
            //new schedule
            $(".list-step").append(html);
            if (_scheduleItem.steps == undefined) {
                _scheduleItem.steps = [];
            }
            _scheduleItem.steps.push(item);
        } else if (_stepScheduleSaveMode == 2) {
            //update schedule
            UpdateScheduleArray(item);
            UpdateScheduleItemUI(item);
        } else {
            //remove schedule
            $("#schedule-item-" + res).remove();
        }
    }
}