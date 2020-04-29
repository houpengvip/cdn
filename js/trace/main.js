$(function() {
	$(".goods-comment-level i").on('click',function(){
		var _this = this;
		var index = $(_this).index();
		$(_this).siblings().removeClass('active');
		for(var i=0;i<=index;i++){
			$(_this).parent().find('i:eq('+ i +')').addClass('active');
		}
	})
});