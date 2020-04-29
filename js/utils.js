(function ($) {
  $.extend({
    // 通用方法封装处理
    common: {
      // 判断字符串是否为空
      isEmpty: function (value) {
        if (value == null || this.trim(value) == "") {
          return true;
        }
        return false;
      },
      // 判断一个字符串是否为非空串
      isNotEmpty: function (value) {
        return !$.common.isEmpty(value);
      },
      // 空对象转字符串
      nullToStr: function (value) {
        if ($.common.isEmpty(value)) {
          return "-";
        }
        return value;
      },
      // 是否显示数据 为空默认为显示
      visible: function (value) {
        if ($.common.isEmpty(value) || value == true) {
          return true;
        }
        return false;
      },
      // 空格截取
      trim: function (value) {
        if (value == null) {
          return "";
        }
        return value.toString().replace(/(^\s*)|(\s*$)|\r|\n/g, "");
      },
      // 比较两个字符串（大小写敏感）
      equals: function (str, that) {
        return str == that;
      },
      // 比较两个字符串（大小写不敏感）
      equalsIgnoreCase: function (str, that) {
        return String(str).toUpperCase() === String(that).toUpperCase();
      },
      // 将字符串按指定字符分割
      split: function (str, sep, maxLen) {
        if ($.common.isEmpty(str)) {
          return null;
        }
        var value = String(str).split(sep);
        return maxLen ? value.slice(0, maxLen - 1) : value;
      },
      // 字符串格式化(%s )
      sprintf: function (str) {
        var args = arguments, flag = true, i = 1;
        str = str.replace(/%s/g, function () {
          var arg = args[i++];
          if (typeof arg === 'undefined') {
            flag = false;
            return '';
          }
          return arg;
        });
        return flag ? str : '';
      },
      // 指定随机数返回
      random: function (min, max) {
        return Math.floor((Math.random() * max) + min);
      },
      // 判断字符串是否是以start开头
      startWith: function (value, start) {
        var reg = new RegExp("^" + start);
        return reg.test(value)
      },
      // 判断字符串是否是以end结尾
      endWith: function (value, end) {
        var reg = new RegExp(end + "$");
        return reg.test(value)
      },
      // 数组去重
      uniqueFn: function (array) {
        var result = [];
        var hashObj = {};
        for (var i = 0; i < array.length; i++) {
          if (!hashObj[array[i]]) {
            hashObj[array[i]] = true;
            result.push(array[i]);
          }
        }
        return result;
      },
      // json数组去重
      uniqueJsonArray: function (array, key) {
        if (array.length == 0) {
          return [];
        }
        var result = [array[0]];
        for (var i = 1; i < array.length; i++) {
          var item = array[i];
          var repeat = false;
          for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            result.push(item);
          }
        }
        return result;
      },
      // 数组中的所有元素放入一个字符串
      join: function (array, separator) {
        if ($.common.isEmpty(array)) {
          return null;
        }
        return array.join(separator);
      },
      // 获取form下所有的字段并转换为json对象
      formToJSON: function (formId) {
        var json = {};
        $.each($("#" + formId).serializeArray(), function (i, field) {
          if (json[field.name]) {
            json[field.name] += ("," + field.value);
          } else {
            json[field.name] = field.value;
          }
        });
        return json;
      },
      // 获取obj对象长度
      getLength: function (obj) {
        var count = 0;
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            count++;
          }
        }
        return count;
      },
      formatDate: function (dateValue, fmt) {
        if (dateValue == null || dateValue == '' || dateValue == undefined) {
          return "";
        }
        var date = new Date(Date.parse(dateValue));
        var o = {
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },
      toDecimal: function (dateValue, length) {
        var f = parseFloat(dateValue);
        if (isNaN(f)) {
          return;
        }
        var f = Math.round(dateValue * Math.pow(10, length)) / Math.pow(10, length);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + length) {
          s += '0';
        }
        return s;
      }
    }
  });
})(jQuery);