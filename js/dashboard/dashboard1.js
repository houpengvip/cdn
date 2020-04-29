var Dashboard = function (orgId, ctx, timeout) {
    var me = this;
    this.orgId = orgId;
    this.ctx = ctx;
    this.timeout = timeout;
    this.orderId = 0;
    // this.orderData = new NewArray();

    /**
     * 中间
     */
    this.realtimeTransactionData = function () {
        var data = new FormData();
        data.append('orgId', this.orgId);
        $.ajax({
                url: this.ctx + 'bigdata/org/realtime/transaction',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        $(".orderCount").text(data.orderCount);
                        $(".totalAmount").text($.common.toDecimal(data.totalAmount, 2));
                        $(".totalWeight").text($.common.toDecimal(data.totalWeight, 2));
                        $(".customerUnitPrice").text($.common.toDecimal(data.customerUnitPrice, 2));
                        setTimeout(function () {
                            me.realtimeTransactionData();
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.realtimeTransactionData();
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.realtimeTransactionData();
                    }, 1000 * timeout);
                }
            }
        );
    }
    function setFont(option){
        var htmlFont=$('html').css("font-size");
        if ($(window).width() < 1024) {
            var fontSize=parseInt(htmlFont.substring(0,htmlFont.length-2))*0.7
            if(option.xAxis[0].axisLabel){
                option.xAxis[0].axisLabel.fontSize=fontSize;
            }else{
                option.xAxis[0].axisLabel={fontSize:fontSize}
            }
            if(option.yAxis[0].axisLabel){
                option.yAxis[0].axisLabel.fontSize=fontSize;
            }else{
                option.yAxis[0].axisLabel={fontSize:fontSize}
            }
        }
        console.log(option)


    }
    /**
     * 今日商户交易额排行
     * @param limit
     */
    this.customerRealTimeAmountDataRanking = function (limit) {
        // console.log(limit)
        var data = new FormData();
        data.append('orgId', this.orgId);
        data.append('limit', limit);

        $.ajax({
                url: this.ctx + 'bigdata/org/customer/realtime/amount/ranking',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        if (data && data.length > 0) {
                            var echartsData = MyEcharts.EchartsDataFormate.ConvertData(data, [
                                {group: '', name: 'customerName', value: 'totalAmount'},
                            ]);
                            var option = MyEcharts.EchartsOption.bar(echartsData, "", "");
                            option.xAxis[0].axisLine.lineStyle.color = "#fff";
                            option.xAxis[0].splitLine.show = false;
                            option.yAxis[0].axisLine.lineStyle.color = "#fff";
                            option.yAxis[0].splitLine.show = false;
                            setFont(option);
                            MyEcharts.initChart(option, "customerRealTimeAmountDataRankingCharts");
                        }

                        setTimeout(function () {
                            me.customerRealTimeAmountDataRanking(limit);
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.customerRealTimeAmountDataRanking(limit);
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.customerRealTimeAmountDataRanking(limit);
                    }, 1000 * timeout);
                }
            }
        );
    }

    /**
     * 今日商户交易量排行
     * @param limit
     */
    this.customerRealTimeWeightDataRanking = function (limit) {
        // console.log(limit)
        var data = new FormData();
        data.append('orgId', this.orgId);
        data.append('limit', limit);
        $.ajax({
                url: this.ctx + 'bigdata/org/customer/realtime/weight/ranking',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        if (data && data.length > 0) {
                            var echartsData = MyEcharts.EchartsDataFormate.ConvertData(data, [
                                {group: '', name: 'customerName', value: 'totalWeight'},
                            ]);
                            var option = MyEcharts.EchartsOption.Line(echartsData, "", "");
                            //console.log(option)
                            option.xAxis[0].axisLine.lineStyle.color = "#fff";
                            option.xAxis[0].splitLine.show = false;
                            option.yAxis[0].axisLine.lineStyle.color = "#fff";
                            option.yAxis[0].splitLine.show = false;
                            setFont(option);
                            MyEcharts.initChart(option, "customerRealTimeWeightDataRankingCharts");
                        }

                        setTimeout(function () {
                            me.customerRealTimeWeightDataRanking(limit);
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.customerRealTimeWeightDataRanking(limit);
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.customerRealTimeWeightDataRanking(limit);
                    }, 1000 * timeout);
                }
            }
        );
    }

    /**
     * 客单价排行
     * @param limit
     */
    this.customerRealTimeOrderUnitPriceDataRanking = function (limit) {
        // console.log(limit)
        var data = new FormData();
        data.append('orgId', this.orgId);
        data.append('limit', limit);
        $.ajax({
                url: this.ctx + 'bigdata/org/customer/realtime/order/unitprice/ranking',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        if (data && data.length > 0) {
                            $(".customerRealTimeOrderUnitPriceDataRanking").empty();
                            $("#customerRealTimeOrderUnitPriceDataRankingTemp").tmpl(data).appendTo(".customerRealTimeOrderUnitPriceDataRanking");
                        }

                        setTimeout(function () {
                            me.customerRealTimeOrderUnitPriceDataRanking(limit);
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.customerRealTimeOrderUnitPriceDataRanking(limit);
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.customerRealTimeOrderUnitPriceDataRanking(limit);
                    }, 1000 * timeout);
                }
            }
        );
    }

    /**
     *今日商品交易量排行
     * @param limit
     */
    this.commodityRealTimeWeightDataRanking = function (limit) {
        // console.log(limit)
        var data = new FormData();
        data.append('orgId', this.orgId);
        data.append('limit', limit);
        $.ajax({
                url: this.ctx + 'bigdata/org/commodity/realtime/weight/ranking',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        if (data && data.length > 0) {
                            var echartsData = MyEcharts.EchartsDataFormate.ConvertData(data, [
                                {group: '', name: 'commodityName', value: 'totalWeight'},
                            ]);
                            var option = MyEcharts.EchartsOption.Line(echartsData, "", "");
                            //console.log(option)
                            option.xAxis[0].axisLine.lineStyle.color = "#fff";
                            option.xAxis[0].splitLine.show = false;
                            option.yAxis[0].axisLine.lineStyle.color = "#fff";
                            option.yAxis[0].splitLine.show = false;
                            setFont(option);
                                MyEcharts.initChart(option, "commodityRealTimeWeightDataRankingCharts");
                        }

                        setTimeout(function () {
                            me.commodityRealTimeWeightDataRanking(limit);
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.commodityRealTimeWeightDataRanking(limit);
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.commodityRealTimeWeightDataRanking(limit);
                    }, 1000 * timeout);
                }
            }
        );
    }

    /**
     *实时交易统计
     * @param limit
     */
    this.orgOrderRealtime = function (limit) {
        // console.log(limit)
        var data = new FormData();
        // console.log("参数", me.orderId)
        data.append('orgId', me.orgId);
        data.append('limit', limit);
        data.append("orderId", me.orderId);
        $.ajax({
                url: this.ctx + 'bigdata/org/order/realtime',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        // console.log(result)
                        if (data.length > 0) {
                            var orderIdTemp = 0;
                            // data.reverse();
                            // console.log(data)
                            data.forEach(function (item) {
                                // console.log(item)
                                // me.orderData.push(item);
                                // console.log($("#orderTemp").tmpl(item).innerHTML)
                                $("#orderTemp").tmpl(item).prependTo(".orderBody");
                                me.orderId = item.orderId;
                            });
                            // console.log("从新赋值", me.orderId)
                        }
                        me.temp();
                        // return;
                        setTimeout(function () {
                            me.orgOrderRealtime(limit);
                        }, 1000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.orgOrderRealtime(limit);
                        }, 1000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.orgOrderRealtime(limit);
                    }, 1000 * timeout);
                }
            }
        );
    }

    this.customerScoreDataRanking = function (limit) {
        var data = new FormData();
        data.append('orgId', me.orgId);
        data.append('limit', limit);
        $.ajax({
                url: this.ctx + 'bigdata/org/customer/score',
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        if (data.length > 0) {
                            var index=1;
                            $(".starBody").empty();
                            data.forEach(function (item) {
                                item.index=index;
                                $("#customerScoreTemp").tmpl(item).appendTo(".starBody");
                                index++;
                            });
                            $('.star').raty({
                                path:'/img/raty',
                                number: 5,
                                readOnly: true,
                                score: function () {
                                    return $(this).attr('data-score');
                                }
                            });
                        }
                        setTimeout(function () {
                            me.customerScoreDataRanking(limit);
                        }, 60000 * timeout);
                    } else {
                        setTimeout(function () {
                            me.customerScoreDataRanking(limit);
                        }, 60000 * timeout);
                    }
                },
                error: function (data) {
                    setTimeout(function () {
                        me.customerScoreDataRanking(limit);
                    }, 60000 * timeout);
                }
            }
        );
    }

  this.temp = function () {
    for (var i = 0; i < $(".orderBody > tr").length; i++) {

      // console.log("执行了temp");

      if ($(".orderBody > tr").length <= 10) {
        //1.822917rem 为一行的高度
        $('.topTable').animate({
          bottom: (10 - $(".orderBody > tr").length) * (1.822917) - 0.6 + "rem"
        }, 100)
      } else {

        $('.topTable').animate({
          bottom: -2.55 + "rem"
        }, 1000, function () {
          if ($(".orderBody > tr").length > 11) {
            $(".orderBody:last").find("tr:last").remove();
            $('.topTable').css("bottom", "-0.6rem")
          }
        });

      }

    }

  }

  this.showOrderData = function () {

    // while (true) {
    var orderBody = $(".orderBody > tr");
    // console.log(orderBody.length)
    // }

    // $("#orderTemp").tmpl(item).appendTo(".orderBody");
    // var trs = $(".orderBody > tr");
    // if (trs.length <= 10) {
    //   var text = $(".orderBody:last"); //定义第一个tr内容
    //   var field = text.find("tr:last"); //获取第一个tr内容
    //   var height = field.height();
    //   $('.topTable').animate({
    //     bottom: (10 - trs.length) * (height / 19.2) - 0.6 + "rem"
    //   }, 100)
    // } else {
    //   var text = $(".orderBody:last"); //定义第一个tr内容
    //   var field = text.find("tr:last"); //获取第一个tr内容
    //   $('.topTable').animate({
    //     bottom: -2.55 + "rem"
    //   }, 600, function () { //隐藏第一行
    //     field.remove();
    //     $('.topTable').css("bottom", "-0.6rem")
    //   })
    // }


  }

}

//在Book的原型上添加的方法实例化之后可以被实例化对象继承
Dashboard.prototype.test = function () {
  console.log('this is test')
}

// class NewArray extends Array {
//   constructor(...args) {
//     // 调用父类Array的constructor()
//     super(...args)
//   }
//
//   push(...args) {
//     console.log('监听到数组的变化啦！');
//
//     var orderBody = $(".orderBody > tr");
//     console.log(orderBody.length)
//     if (orderBody.length <= 10) {
//       $("#orderTemp").tmpl(args).appendTo(".orderBody");
//       var text = $(".orderBody:last"); //定义第一个tr内容
//       var field = text.find("tr:last"); //获取第一个tr内容
//       var height = field.height();
//       $('.topTable').animate({
//         bottom: (10 - orderBody.length) * (height / 19.2) - 0.6 + "rem"
//       }, 1000)
//     } else {
//       $("#orderTemp").tmpl(args).appendTo(".orderBody");
//       var text = $(".orderBody:last"); //定义第一个tr内容
//       var field = text.find("tr:last"); //获取第一个tr内容
//       $('.topTable').animate({
//         bottom: -2.55 + "rem"
//       }, 1000, function () { //隐藏第一行
//         field.remove();
//         $('.topTable').css("bottom", "-0.6rem")
//       })
//     }
//
//
//     // 调用父类原型push方法
//     return super.push(...args)
//   }
//
//   // ...
// }