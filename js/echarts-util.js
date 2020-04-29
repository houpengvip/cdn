/**
 * 封装echarts 工具
 */
/**
 * 数组是否存在
 */

Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};
/**
 * 数组中最大值 最小值
 * @param array
 * @returns
 */
Array.prototype.max = function () {
  return Math.max.apply({}, this);
};
Array.prototype.min = function () {
  return Math.min.apply({}, this);
};

/**
 * 判断是否为整数
 * @param obj
 * @returns {Boolean}
 */
function isInteger(obj) {
  return obj % 1 === 0
}

var MyEcharts = {
  //整理数据没有分组类型的，适合饼图
  EchartsDataFormate: {
    /**
     *
     * @param data 后台数据 [{customerName:'a',purchaseCount:10},{customerName:'b',purchaseCount:20}]
     * @param convertMapping {[group:'进场次数',name:'customerName',value:'rowCount']} key只能为group，name，value
     * @returns {[]}
     * @constructor
     */
    ConvertData: function (data, convertMapping,emptyVal) {
      var convertRes = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < convertMapping.length; j++) {
          var dataObj = {};
          var mapping = convertMapping[j];
          for (var key in mapping) {
            if(!data[i].hasOwnProperty(mapping[key])){
              dataObj[key]=mapping[key];
            }else{
              var dataVal = data[i][mapping[key]];
              dataObj[key] = (dataVal == null) ? emptyVal : dataVal;
            }
          }
          convertRes.push(dataObj);
        }
      }
      return convertRes;
    },
    /**
     *
     */
    NoGroupFormate: function (data) {
      //category 的数据存储
      var categorys = [];
      //data 的数据存储
      var datas = [];
      //遍历
      for (var i = 0; i < data.length; i++) {
        categorys.push(data[i].name || "");
        //定义一个中间变量
        var temp_data = {value: data[i].value || 0, name: data[i].name || ""};
        datas.push(temp_data);
      }
      return {categorys: categorys, data: datas};
    },
    //整理数据有分组类型的，适合折线图、柱形图（分组，堆积）
    //数据格式：group：XXX，name：XXX，value：XXX
    /**
     * @param data : json数据<br>
     * @param type : 图表类型<br>
     * var data1 = [ <br>
     *      { group:'类型1' , name: '1月', value: 10 }, <br>
     *    { group:'类型2' , name: '1月', value: 15 }, <br>
     *    { group:'类型1' , name: '2月', value: 25 }, <br>
     *    { group:'类型2' , name: '2月', value: 12 }, <br>
     *    { group:'类型1' , name: '3月', value: 22 }, <br>
     *    { group:'类型2' , name: '3月', value: 12 }, <br>
     *    ];
     *
     */
    GroupFormate: function (data, type, stack, label) {
      //用于存储类型名称
      var groups = new Array();
      //用于存储data.name数据
      var names = new Array();
      //存储返回series数据 （一个或者多个）
      var series = new Array();

      for (var i = 0; i < data.length; i++) {
        //判断data[i].group是否存在数租groups中
        if (!groups.contains(data[i].group)) {
          //不存在则跳进 存放
          groups.push(data[i].group);
        }

        //判断name数据是否存在 数组names中
        if (!names.contains(data[i].name)) {
          //不存在则跳进 存放
          names.push(data[i].name);
        }
      }
      var baseWidth = 90 / groups.length / 2;
      //遍历分类
      for (var i = 0; i < groups.length; i++) {
        //定义一个series中间变量
        var temp_series = {};
        //定义data.value数据存储
        var temp_data = new Array();
        //遍历所有数据
        for (var j = 0; j < data.length; j++) {
          //遍历data.name数据
          for (var k = 0; k < names.length; k++) {
            //判断所有分类中的所有数据含name数据分开
            if (groups[i] == data[j].group && names[k] == data[j].name) {

              temp_data.push(data[j].value);
            }
          }
        }
        temp_series = {name: groups[i], type: type, data: temp_data};
        if(data[i].hasOwnProperty('yIndex')){
          temp_series.yAxisIndex=data[i].yIndex;
        }
        if (type == 'bar') {
          temp_series.barMaxWidth = 60;
        }
        if (type == 'line') {
          temp_series.smooth = true;
        }
        if (stack) {
          temp_series.stack = stack;
        }
        if (label) {
          temp_series.label = label;
        }
        if (type == 'pie') {
          temp_series.radius = '50%';
          temp_series.center = [(baseWidth * (i * 2 + 1)) + '%', '50%'];
        }

        series.push(temp_series);

      }
      return {groups: groups, category: names, series: series};
    },
    GroupPieFormate: function (data) {
      //用于存储类型名称
      var groups = new Array();
      //用于存储data.name数据
      var names = new Array();
      //存储返回series数据 （一个或者多个）
      var series = new Array();

      for (var i = 0; i < data.length; i++) {
        //判断data[i].group是否存在数租groups中
        if (!groups.contains(data[i].group)) {
          //不存在则跳进 存放
          groups.push(data[i].group);
        }

        //判断name数据是否存在 数组names中
        if (!names.contains(data[i].name)) {
          //不存在则跳进 存放
          names.push(data[i].name);
        }
      }
      var baseWidth = 95 / groups.length / 2;
      //遍历分类
      for (var i = 0; i < groups.length; i++) {
        //定义一个series中间变量
        var temp_series = {};
        //定义data.value数据存储
        var temp_data = new Array();
        //遍历所有数据
        for (var j = 0; j < data.length; j++) {
          //遍历data.name数据
          for (var k = 0; k < names.length; k++) {
            //判断所有分类中的所有数据含name数据分开
            if (groups[i] == data[j].group && names[k] == data[j].name) {
              temp_data.push({name: names[k], value: data[j].value != 0 ? data[j].value : NaN});
            }
          }
        }
        temp_series = {name: groups[i], type: 'pie', data: temp_data};
        temp_series.radius = '50%';
        temp_series.center = [(baseWidth * (i * 2 + 1)) + '%', '50%'];
        series.push(temp_series);

      }
      return {groups: groups, category: names, series: series};
    },
    /**
     * 雷达图数据格式化
     */
    RadarFormate: function (data, type) {
      //用于存储类型名称
      var groups = new Array();
      //用于存储data.name数据
      var names = new Array();
      //存储最大值数组
      var indicators = new Array();
      //定义data.value数据存储
      var temp_data = new Array();
      for (var i = 0; i < data.length; i++) {
        //判断data[i].group是否存在数租groups中
        if (!groups.contains(data[i].group)) {
          //不存在则跳进 存放
          groups.push(data[i].group);
        }

        //判断name数据是否存在 数组names中
        if (!names.contains(data[i].name)) {
          //不存在则跳进 存放
          names.push(data[i].name);
        }
      }

      for (var i = 0; i < names.length; i++) {
        //中
        var temp_maxValue = new Array();
        for (var j = 0; j < data.length; j++) {
          if (names[i] == data[j].name) {
            temp_maxValue.push(data[j].value);
          }
        }
        indicators.push({name: names[i], max: Number(temp_maxValue.max() * 2 / 1.5).toFixed(2)})
      }
      //遍历分类
      for (var i = 0; i < groups.length; i++) {
        //定义一个series中间变量
        var temp_series = {};
        //定义datavalue数组
        var dataValues = new Array();
        //遍历所有数据
        for (var j = 0; j < data.length; j++) {
          if (groups[i] == data[j].group) {
            dataValues.push(data[j].value);
          }
        }
        temp_data.push({value: dataValues, name: groups[i]});
      }
      series = {type: type, data: temp_data};
      return {indicators: indicators, groups: groups, category: names, series: series};
    },
    /**
     * 漏斗图数据格式化
     */
    FunnelFormate: function (data, type) {
      //用于存储类型名称
      var groups = new Array();
      //用于存储data.name数据
      var names = new Array();
      //定义一个存放series的数组
      var series = new Array();
      for (var i = 0; i < data.length; i++) {
        //判断data[i].group是否存在数租groups中
        if (!groups.contains(data[i].group)) {
          //不存在则跳进 存放
          groups.push(data[i].group);
        }

        //判断name数据是否存在 数组names中
        if (!names.contains(data[i].name)) {
          //不存在则跳进 存放
          names.push(data[i].name);
        }
      }
      var width = parseInt(100 / groups.length);
      //遍历分类
      for (var i = 0; i < groups.length; i++) {
        //定义data.value数据存储
        var temp_data = new Array();
        var k = 0;
        //遍历所有数据
        for (var j = 0; j < data.length; j++) {
          //判断所有分类中的所有数据含name数据分开
          if (groups[i] == data[j].group) {
            k++;
            temp_data.push({value: k, name: data[j].name + ":" + data[j].value});
          }
        }
        var left = width * i;
        series.push({
          name: groups[i],
          type: type,
          sort: 'ascending',
          grap: 2,
          left: left + "%",
          width: width - 5 + "%",
          label: {
            normal: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          data: temp_data
        });
      }
      return {groups: groups, category: names, series: series};
    },
    /**
     * 仪表盘图数据格式化
     */
    GaugeFormate: function (data, type) {
      var temp_datas = [{value: data.value, name: data.name}];
      var names = data.name;
      //判断最大值和最小值几位数
      maxNum = Number(parseInt(data.value)).toString().length;
      minNum = Number(parseInt(data.value)).toString().length;
      if (minNum <= 2) {
        min = 0;
      } else {
        //最小值
        min = Math.pow(10, (maxNum - 1));
      }
      //最大值
      max = Math.pow(10, maxNum);
      var series = new Array();
      series.push({
        name: data.group,
        type: type,
        min: min,
        max: max,
        radius: '70%',
        startAngle: 180,
        endAngle: -0,
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
            width: 3,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          }
        },
        axisLabel: {            // 坐标轴小标记
          textStyle: {       // 属性lineStyle控制线条样式
            fontWeight: 'bolder',
            color: '#444',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          }
        },
        axisTick: {            // 坐标轴小标记
          length: 15,        // 属性length控制线长
          lineStyle: {       // 属性lineStyle控制线条样式
            color: 'auto',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          }
        },
        splitLine: {           // 分隔线
          length: 25,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            width: 3,
            color: 'auto',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          }
        },
        pointer: {           // 分隔线
          shadowColor: '#fff', //默认透明
          shadowBlur: 5
        },
        title: {
          offsetCenter: ['-10%', '30%'],
          textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            fontSize: 14,
            fontStyle: 'italic',
            color: '#',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          }
        },
        detail: {
          backgroundColor: 'rgba(30,144,255,0.8)',
          borderWidth: 1,
          borderColor: '#fff',
          shadowColor: '#fff', //默认透明
          shadowBlur: 5,
          fontSize: 14,
          offsetCenter: ['20%', '30%'],       // x, y，单位px
          textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            color: '#fff'
          }
        },
        data: temp_datas
      });
      return {category: names, series: series};
    }

  },

  //生成图形option
  EchartsOption: {
    /**
     * 饼图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     *
     */
    pie: function (data, title, subtext) {
      //数据格式
      var datas = MyEcharts.EchartsDataFormate.NoGroupFormate(data);
      option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //组建
        legend: {
          orient: 'horizontal', //垂直：vertical； 水平 horizontal
          // top: 'center',	//位置默认左
          bottom: '5%',
          data: datas.categorys
        },
        series: [
          {
            name: title || "",
            type: 'pie',	//类型
            radius: '48%', //圆的大小
            center: ['50%', '50%'],//位置居中
            data: datas.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            //引导线
            labelLine: {
              normal: {
                show: true,
                length: 2,
              }
            }
          }
        ]
      };
      return option;
    },
    groupPie: function (data, title, subtext) {
      //数据格式
      var datas = MyEcharts.EchartsDataFormate.GroupPieFormate(data);
      option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 50,
          top: 50,
          bottom: 20,
          data: datas.category,
        },
        series: datas.series,
      };
      return option;
    },
    /**
     * 柱形图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     * @param xAxisName : x轴名称
     */
    bar: function (data, xAxisName, yAxisName, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.GroupFormate(data, 'bar');
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'left',	//位置默认居中
        },
        //提示
        tooltip: {
          trigger: 'axis'
        },
        //组建
        legend: {
          orient: 'horizontal', //垂直：vertical； 水平 horizontal
          left: 'center',	//位置默认左
          data: datas.groups
        },
        grid: {
          left: '15%',
          top: '25%',
          right: '10%',
          bottom: '25%',
        },
        //水平坐标
        xAxis: [
          {
            type: 'category',
            data: datas.category,
            name: datas.category.length>0?xAxisName:'',
            splitLine: {//去除网格线
              show: true
            },
            axisLine: {//设置轴线的属性
              lineStyle: {
                color: '#000',
                // width: 8,//这里是为了突出显示加上的
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 20,//倾斜度 -90 至 90 默认为0
              margin: 10
            }
          }
        ],
        //垂直坐标
        color: ['#1f74f1', '#c23531', '#333333'],
        yAxis: [
          {
            name: datas.category.length>0?yAxisName:'',
            type: 'value',
            axisLine: {//设置轴线的属性
              lineStyle: {
                color: '#000',
              }
            },
            splitLine: {//去除网格线
              show: true
            }
          }
        ],
        //series数据
        series: datas.series
      };
      return option;
    },
    barStack: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.GroupFormate(data, 'bar', '总量', {
        normal: {
          show: true,
          position: 'insideRight'
        }
      });
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'left',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        //组建
        legend: {
          orient: 'horizontal', //垂直：vertical； 水平 horizontal
          left: 'center',	//位置默认左
          data: datas.groups
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        //水平坐标
        xAxis: {
          type: 'value'
        },
        //垂直坐标
        yAxis: {
          type: 'category',
          data: datas.category
        },
        //series数据
        series: datas.series
      };
      return option;
    },

    /**
     * 折线图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    Line: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.GroupFormate(data, 'line');
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        //组建
        legend: {
          orient: 'vertical', //垂直：vertical； 水平 horizontal
          left: 'right',	//位置默认右
          data: datas.groups
        },
        grid: {
          left: '15%',
          top: '25%',
          right: '10%',
          bottom: '25%',
        },
        //水平坐标
        xAxis: [
          {
            type: 'category',
            data: datas.category,
            axisLabel: {
              interval:0,
              rotate:40
            },
            boundaryGap: false,
            axisLine: {//设置轴线的属性
              lineStyle: {
                color: '#000',
              }
            },
            splitLine: {//去除网格线
              show: false
            },
          }
        ],
        //垂直坐标
        yAxis: [
          {
            type: 'value',
            axisLine: {//设置轴线的属性
              lineStyle: {
                color: '#000',
              }
            },
            splitLine: {//去除网格线
              show: false
            }
          }
        ],
        //series数据
        series: datas.series
      };
      return option;
    },
    multipleLine: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.GroupFormate(data, 'line');
      var yDatas=datas.groups.map(function(item,index){
        return {
          name: item,
          type: 'value',
          yAxisIndex:index,
          axisLine: {//设置轴线的属性
            lineStyle: {
              color: '#000',
            }
          },
          splitLine: {//去除网格线
            show: false
          }
        }
      });
      var option = {
        color: [
          "#C23531",
          "#00A65A",
          "#0087B4",
          "#72ccff",
          "#f7c5a0",
          "#d4a4eb",
          "#d2f5a6",
          "#76f2f2"
        ],
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'left',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        //组建
        legend: {
          orient: 'horizontal', //垂直：vertical； 水平 horizontal
          left: 'center',	//位置默认右
          data: datas.groups
        },
        grid: {
          left: '5%',
          top: '25%',
          right: '5%',
          bottom: '15%',
        },
        //水平坐标
        xAxis: [
          {
            type: 'category',
            data: datas.category,
            axisLabel: {
              interval:0,
              rotate:40
            },
            boundaryGap: false,
            axisLine: {//设置轴线的属性
              lineStyle: {
                color: '#000',
              }
            },
            splitLine: {//去除网格线
              show: false
            },
          }
        ],
        //垂直坐标
        yAxis: yDatas,
        //series数据
        series: datas.series
      };
      return option;
    },
    /**
     * 雷达图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    Radar: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.RadarFormate(data, 'radar');
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
        },
        //组建
        legend: {
          orient: 'vertical', //垂直：vertical； 水平 horizontal
          left: 'left',	//位置默认左
          data: datas.groups
        },
        radar: {
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: datas.indicators
        },
        series: datas.series
      };
      return option;
    },
    /**
     * 漏斗图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    Funnel: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.FunnelFormate(data, 'funnel');
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: "{a} <br/>{b} ({c}%)"
        },
        //组建
        legend: {
          orient: 'vertical', //垂直：vertical； 水平 horizontal
          left: 'left',	//位置默认左
          data: datas.groups
        },
        series: datas.series
      };
      return option;
    },
    /**
     * 仪表图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    Gauge: function (data, title, subtext) {
      var datas = MyEcharts.EchartsDataFormate.GaugeFormate(data, 'gauge');
      var option = {
        //标题
        title: {
          text: title || "",	//标题
          subtext: subtext || "", //副标题
          x: 'center',	//位置默认居中
        },
        //提示
        tooltip: {
          show: true,
          formatter: "{a} <br/>{b}:{c}"
        },
        series: datas.series
      };
      return option;
    }
  },

  /**
   *
   * @param option : option
   * @param echartId : 图表的id 需要加引号
   */
  initChart: function (option, echartId) {
    // var container = eval("document.getElementById('" + echartId + "')");
    var container = document.getElementById(  echartId );
    var myChart = echarts.init(container);
    myChart.setOption(option,true);	// 为echarts对象加载数据 myChart.clear();
    return myChart;
  }


};
