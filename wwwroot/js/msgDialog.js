﻿function ShowOkCancelDialog(title, message, okFunc) {
    var dialog ='<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered">' +
                        '<div class="modal-content">'+
                            '<div class="modal-header">' +
                                '<h1 class="modal-title fs-5" id="staticBackdropLabel">' + title +'</h1>' +
                                '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                message +
                            '</div>' +
                            '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>' +
                                '<button type="button" class="btn btn-primary" onclick="ClickOkButtonFunc()">Ok</button>' +
                                '</div>' +
                            '</div>' +
        '</div>' +
        '</div>' +
                    '</div>'
    $("body").append(dialog);
    const myModalEl = document.getElementById('exampleModal')
    const modal = new bootstrap.Modal(myModalEl);
    _modal = modal;
    _callOkButtonClick = okFunc;
    
    myModalEl.addEventListener('hidden.bs.modal', event => {
        $("#exampleModal").remove();
    })
    _modal.show();
}
var _modal = {};
var _callOkButtonClick = {}
function ClickOkButtonFunc() {
    _callOkButtonClick();
    _modal.hide();
   
}

function ShowCheckboxListDialog(title, list, okFunc) {
    var listcheckbox = '<ul class="list-group">'
    $(list).each(function () {
        var checked = "";
        var disabled = "";
        if (this.ischecked == 1) {
            checked = " checked ";
        }
        if (this.isdisable == 1) {
            disabled = " disabled ";
        }
        var idkvaccountschedule = "";
        if (this.idkvaccountschedule) {
            idkvaccountschedule = 'data-idkvaccountschedule="' + this.idkvaccountschedule + '"'
        }
        var item = '<li class="list-group-item">' +
            '<input class="form-check-input me-1" type="checkbox" ' + checked + disabled + ' id="chk-' + this.idvalue + '" data-id="' + this.idvalue + '" ' + idkvaccountschedule +' >' +
            '<label class="form-check-label" for="chk-' + this.idvalue +'">'+this.displayvalue+'</label>'+
            '</li>'
        listcheckbox = listcheckbox + item;
    })
    listcheckbox = listcheckbox + "<ul/>"
    var dialog = '<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h1 class="modal-title fs-5" id="staticBackdropLabel">' + title + '</h1>' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body checkbox-body-modal">' +
        listcheckbox +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>' +
        '<button type="button" class="btn btn-primary" onclick="ClickOkButtonFunc()">Ok</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(dialog);
    const myModalEl = document.getElementById('exampleModal')
    const modal = new bootstrap.Modal(myModalEl);
    _modal = modal;
    _callOkButtonClick = okFunc;

    myModalEl.addEventListener('hidden.bs.modal', event => {
        $("#exampleModal").remove();
    })
    _modal.show();
}

function ShowToastMessage(msg) {
    var html = '<div id="myToastEl" class="toast position-fixed top-0 end-0 text-white bg-success" role="alert" aria-live="assertive" aria-atomic="true" data-bs-animation="true" data-bs-delay="2000">' +
        '<div class="d-flex">' +
        '<div class="toast-body">' +
        msg +
        '</div>' +
        '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
        '</div>' +
        '</div>';
    $("body").append(html);
    var myToastEl = document.getElementById('myToastEl')
    var myToast = bootstrap.Toast.getOrCreateInstance(myToastEl)
    myToastEl.addEventListener('hidden.bs.toast', function () {
        $("#myToastEl").remove();
    })
    myToast.show();
}