var options = {
    useEasing: true, // 使用缓和效果
    useGrouping: true, // 使用分组效果
    separator: ',', // 分离器，数据够三位，例如100,000
    decimal: '.', // 小数点分割，例如：10.00
    prefix: '', // 第一位默认数字，例如：¥
    suffix: '' // 最后一位默认数字，例如：元，美元
}

// new CountUp(target, startVal, endVal, decimals, duration, options)
// target = 目标元素的 ID
// startVal = 开始值
// endVal = 结束值
// decimals = 小数位数 默认值是0
// duration = 动画延迟秒数，默认值是2；
// options = optional object of options (see below)

$.fn.extend({
    countUp:function(params){
        var defaultParams={
            startVal:0, //开始值
            endVal:0,  //结束值
            duration:2, //动画时间
            decimal:2  //小数点位数
        }
        $.extend(defaultParams,params);
        return new CountUp(this.attr('id'), defaultParams.startVal, defaultParams.endVal, defaultParams.decimal, defaultParams.duration, options);
    },
    startCountUp:function(params){
        var defaultParams={
            startVal:0, //开始值
            endVal:0,  //结束值
            duration:1, //动画时间
            decimal:2  //小数点位数
        }
        $.extend(defaultParams,params);
        var up=new CountUp(this.attr('id'), defaultParams.startVal, defaultParams.endVal, defaultParams.decimal, defaultParams.duration, options);
        if (!up.error) {
            up.start()
        } else {
            console.error(up.error)
        }
        return up;
    }

})

