var formId = '';
var removeArr = [];
var options = {
    data: [],
    columns: [
        {
            field: 'purchaseDetailId',
            title: 'ID',
            visible: false,
        },
        {
            field: 'rowIndex',
            title: "序号",
            visible: false
        },
        {
            field: 'commodityId',
            title: '商品',
            width: '15%',
            formatter: function (value, row, index) {
                var opt = "";
                if (row.commodityId) {
                    opt = "<option value='" + row.commodityId + "'>" + row.commodityName + "</option>"
                }
                var html = '';
                if (row.purchaseDetailId) {
                    html = $.common.sprintf(" <input type='hidden' name='detailList[%s].purchaseDetailId' value='%s'>", index, row.purchaseDetailId);
                    html += $.common.sprintf("<select class='form-control detailCommodity' name='detailList[%s].commodityId' value='%s' disabled data-rule-required='true' data-msg-required=' '>" + opt + "</select>", index, value);
                } else {
                    html = $.common.sprintf("<select class='form-control detailCommodity' name='detailList[%s].commodityId' value='%s' data-rule-required='true' data-msg-required=' '>" + opt + "</select>", index, value);
                }
                return html;
            }
        },
        {
            field: 'num',
            title: '数量',
            width: '10%',
            formatter: function (value, row, index) {
                var html = $.common.sprintf("<div><input class='form-control' type='number'  min='0.01' step='0.01' name='detailList[%s].num' value='%s' data-rule-required='true' data-msg-required=' '></div>", index, value);
                return html;
            }
        },
        {
            field: 'price',
            title: '单价',
            width: '10%',
            formatter: function (value, row, index) {
                var html = $.common.sprintf("<input class='form-control' type='text' min='0.01' step='0.01' name='detailList[%s].price' value='%s' data-rule-required='true' data-msg-required=' '>", index, value);
                return html;
            }
        },
        {
            field: 'supplierId',
            title: '供应商',
            width: '13%',
            formatter: function (value, row, index) {
                var opt = "";
                if (row.supplierId) {
                    opt = "<option value='" + row.supplierId + "'>" + row.supplierName + "</option>"
                }
                var html = $.common.sprintf("<select class='form-control supplierControl' name='detailList[%s].supplierId' value='%s'>" + opt + "</select>", index, value);
                return html;
            }
        },
        {
            field: 'vendorName',
            title: '供货商家',
            width: '12%',
            formatter: function (value, row, index) {
                var html = $.common.sprintf("<input class='form-control' type='text' name='detailList[%s].vendorName' value='%s'>", index, value);
                return html;
            }
        },
        {
            field: 'certNum',
            title: '产地证明',
            width: '12%',
            formatter: function (value, row, index) {
                var html = $.common.sprintf("<input class='form-control' type='text' name='detailList[%s].certNum' value='%s'>", index, value);
                return html;
            }
        },
        {
            field: 'productionBase',
            title: '生产基地',
            width: '12%',
            formatter: function (value, row, index) {
                var html = $.common.sprintf("<input class='form-control' type='text' name='detailList[%s].productionBase' value='%s'>", index, value);
                return html;
            }
        },
        {
            field: 'originRegionId',
            title: '产地',
            width: '13%',
            formatter: function (value, row, index) {
                var opt = "";
                if (row.originRegionId) {
                    opt = "<option value='" + row.originRegionId + "'>" + row.originRegionName + "</option>"
                }
                var html = $.common.sprintf("<select  class='form-control originPlaceControl' name='detailList[%s].originRegionId' value='%s'>" + opt + "</select>", index, value);
                return html;
            }
        },
        {
            title: '',
            width: '50px',
            formatter: function (value, row, index) {
                var actions = [];
                actions.push('<a class="btn btn-danger btn-xs" href="#" onclick="removeRow(\'' + index + '\')"><i class="fa fa-remove"></i></a>');
                return actions.join('');
            }
        }]

};


function changeAddPulsState() {
    var commodityType = $("#commodityTypeId").val();
    if ($.inArray(commodityType,meatIdsArr)!=-1) {
        // 肉类只能有一条明细
        options.columns[7].title = "检疫检验证号";
        options.columns[7].formatter=function (value, row, index) {
            var html = $.common.sprintf("<input class='form-control' type='text' name='detailList[%s].certNum' value='%s' required>", index, value);
            return html;
        }
        var dataLength = options.data.length;
        if(dataLength==1){
            $("#addPurchaseDetail").addClass("disabled");
        }else{
            $("#addPurchaseDetail").removeClass("disabled");
        }

    } else {
        options.columns[7].title = "产地证明";
        options.columns[7].formatter=function (value, row, index) {
            var html = $.common.sprintf("<input class='form-control' type='text' name='detailList[%s].certNum' value='%s'>", index, value);
            return html;
        }
        $("#addPurchaseDetail").removeClass("disabled");
    }
}

function initMainSelect() {
    $("#commodityTypeId").on("select2:select", function (evt) {

        var customerVal = $("#customerId").val();
        if (customerVal) {
            $("#bootstrap-table").bootstrapTable("removeAll");
            initRow();
        }


    })
    // initTable();
    if ($("#orgId").val()) {
        initSelectSearch("#customerId", "base/customer/search", {orgId: $("#orgId").val()}, "请选择");
    }
    $("#orgId").on("select2:select", function (evt) {
        $(".selectPlaceholder").val('');
        $("#bootstrap-table").bootstrapTable("removeAll");
        initSelectSearch("#customerId", "base/customer/search", {orgId: $("#orgId").val()}, "请选择");
    })
    $("#customerId").on("select2:select", function (evt) {
        $("#bootstrap-table").bootstrapTable("removeAll");
        if ($("#commodityTypeId").val()) {
            initRow();
        }
    })
}

function initTable() {
    $('#bootstrap-table').bootstrapTable('destroy');
    changeAddPulsState();
    $('#bootstrap-table').bootstrapTable(options);
    selectCommodityTypeSub();
    initOriginSelect();
    initSupplierSelect();
}

function selectCommodityTypeSub() {
    initSelectSearch(".detailCommodity", "base/customerCommodity/search", {
        customerId: $("#customerId").val(),
        commodityTypeId: $("#commodityTypeId").val()
    }, "点击查询商品");
}

function initOriginSelect() {
    initSelectSearch(".originPlaceControl", "system/region/search", {}, "点击查询产地");
}

function initSupplierSelect() {
    initSelectSearch(".supplierControl", "base/supplier/search", {orgId: $("#orgId").val()}, "点击查询");
}

function getData() {

    var dataLength = options.data.length;
    var arr = [];
    if (dataLength > 0) {
        var formData = serializeJson();
        var data = $("#bootstrap-table").bootstrapTable('getData');
        for (var i = 0; i < dataLength; i++) {
            var obj = {};
            obj.purchaseDetailId = data[i].purchaseDetailId || '';
            obj.num = formData['detailList[' + i + '].num'] || '';
            obj.price = formData['detailList[' + i + '].price'] || '';
            obj.productionBase = formData['detailList[' + i + '].productionBase'] || '';
            obj.vendorName = formData['detailList[' + i + '].vendorName'] || '';
            obj.certNum = formData['detailList[' + i + '].certNum'] || '';
            // 保存商品下拉框值
            saveCommoboxValue(obj, i, 'commodityId', 'commodityName');
            // 保存供应商下拉框值
            saveCommoboxValue(obj, i, 'supplierId', 'supplierName');
            // 保存产地下拉框值
            saveCommoboxValue(obj, i, 'originRegionId', 'originRegionName');
            arr.push(obj);
        }
    }
    return arr;
}

function saveCommoboxValue(obj, i, idField, valueField) {
    var commobox = $('select[name="detailList[' + i + '].' + idField + '"]');
    var select2Data = commobox.select2('data');
    if (select2Data && select2Data[0]) {
        obj[idField] = select2Data[0].id;
        obj[valueField] = select2Data[0].text;
    } else {
        obj[idField] = '';
    }
}

function initRow() {
    var arr = getData();
    arr.push(getEmptyRow());
    options.data = arr;
    initTable();
}

function insertRow() {
    if (!$("#customerId").val()) {
        $.modal.alertWarning("请先选择进场商户");
        return;
    }
    initRow();

}

function getEmptyRow() {
    return {
        num: '',
        price: '',
        commodityId: '',
        commodityName: '',
        supplierId: '',
        supplierName: '',
        originRegionId: '',
        originRegionName: '',
        vendorName: '',
        certNum: '',
        productionBase: ''
    };
}

function serializeJson() {
    var paramJson = {};
    var paramArr = $('#' + formId).serializeArray();
    $(paramArr).each(function (index, obj) {
        paramJson[obj.name] = obj.value;
    });
    return paramJson;
}

function removeRow(index) {
    var arr = getData();
    var rowData = arr[index];
    if (rowData.purchaseDetailId) {
        removeArr.push(rowData.purchaseDetailId);
    }
    arr.splice(index, 1);
    options.data = arr;
    changeAddPulsState();
    initTable();
}