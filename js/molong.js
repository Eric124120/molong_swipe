/**
 * Created by Administrator on 2015/12/19.
 */
var molong=molong?molong:{};
molong.photoSwipe=function(options){
    //给大图查看器添加一个独立的容器
    var bigContainerString="<div class=\"molong-swiper syswin-swipe-hide\">"+
        "<ul id=\"bigImg\"></ul>"+
        "</div>";
    $("body").append(bigContainerString);
    var swipeSelf=this;
    var screenHeight=window.innerHeight;
    var screenWidth=window.innerWidth;
    var minImageWidth=screenWidth*0.25;//显示小图的宽高
    var bigIndex=0;         //大图索引
    var bigImgOffset=0;        //大图滑动的位置
    var bigImgLength=0;    //大图数量
    //缩放设置
    var initialScale = 1;   //初始缩放比例
    var currentScale=1;      //当前缩放比例
    var pinchSelf;         //当前缩放比例的对象
    var dragSelf;          //当前拖拽的对象
    //解析参数
    swipeSelf.options=$.extend({
        listContainer:$("ul"),
        swipeRigth:true,
        swipeLeft:true,
        pinch:true
    },options);
    //容器
    swipeSelf.listContainer=options.listContainer; //小图容器

    swipeSelf.swipeContainer=$("#bigImg"); //大图容器
    //阻止touchstart默认事件
    touch.on(this.swipeContainer, 'touchstart', function(ev){
        ev.preventDefault();
    });
    swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.3s");//设置动画事件
    //显示大图
    swipeSelf.showBigImg=function(){
        var imgs=swipeSelf.listContainer.find("li");
        var bigImgsUrl=[];
        var bigImgString="";
        bigImgLength=imgs.length;
        bigImgOffset=-screenWidth*bigIndex;
        for(var i=0;i<bigImgLength;i++){
            var bigImgUrl=$(imgs[i]).attr("big-url");
            bigImgsUrl.push(bigImgUrl);
            bigImgString+='<li class="molong-swiper-item"><div class="img-div" style="background-image: url('+bigImgUrl+')"></div></li>';
        }
        swipeSelf.swipeContainer.html(bigImgString);
        swipeSelf.swipeContainer.height(screenHeight);
        swipeSelf.swipeContainer.width(screenWidth*bigImgLength);
        $(".molong-swiper-item").height(screenHeight);
        $(".molong-swiper-item").width(screenWidth);
        $(".img-div").height(screenHeight);
        $(".img-div").width(screenWidth);
        swipeSelf.swipeContainer.css("-webkit-transform","translate3d("+bigImgOffset+"px,0,0)");
        $(".molong-swiper").show();
        //添加事件监听，监听查看大图
        if(swipeSelf.listenShow){
            swipeSelf.listenShow();
        }
    }
    //隐藏大图
    swipeSelf.hideBigImg=function() {
        $(".molong-swiper").hide();
        swipeSelf.swipeContainer.html("");
        if(swipeSelf.listenHide){
            swipeSelf.listenHide();
        }
    }
    //右滑动
    swipeSelf.swipeRight=function(){
        touch.on(swipeSelf.swipeContainer, 'swiperight',"li", function(ev){
            console.log("swiperight");
            if(swipeSelf.options.swipeRigth){
                //$(".img-div").css("-webkit-transform","translate3d(0px, 0px, 0px)");//元素移动复位
                swipeSelf.dx=0;
                swipeSelf.dy=0;
                console.log("向右滑动.");
                if(pinchSelf){
                    pinchSelf.style.webkitTransform = 'scale(1)';
                    currentScale=1;
                }
                bigImgOffset+=screenWidth;
                bigImgOffset=bigImgOffset>=0?0:bigImgOffset;
                swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.5s");//设置动画事件
                swipeSelf.swipeContainer.css("-webkit-transform","translate3d("+bigImgOffset+"px,0,0)");
            }
        });
    }
    //左滑动
    swipeSelf.swipeLeft=function(){
        touch.on(swipeSelf.swipeContainer, 'swipeleft','li', function(ev){
            console.log("swipeleft");
            if(swipeSelf.options.swipeLeft){
                console.log("向左滑动.");
                // $(".img-div").css("-webkit-transform","translate3d(0px, 0px, 0px)");//元素移动复位
                swipeSelf.dx=0;
                swipeSelf.dy=0;
                if(pinchSelf){
                    pinchSelf.style.webkitTransform = 'scale(1)';
                    currentScale=1;
                }
                bigImgOffset-=screenWidth;
                bigImgOffset=Math.abs(bigImgOffset)>=(screenWidth*bigImgLength)?(-screenWidth*(bigImgLength-1)):bigImgOffset;
                swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.5s");//设置动画事件
                swipeSelf.swipeContainer.css("-webkit-transform","translate3d("+bigImgOffset+"px,0,0)");
            }
        });
    }
    //缩放
    swipeSelf.pinche=function(){
        touch.on(swipeSelf.swipeContainer, 'pinchend',".img-div", function(ev){
            console.log("pinchend");
            if(swipeSelf.options.pinch){
                pinchSelf=this;
                currentScale = ev.scale - 1;
                currentScale = initialScale + currentScale;
                currentScale = currentScale > 2 ? 2 : currentScale;
                currentScale = currentScale < 1 ? 1 : currentScale;
                swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.1s");//设置动画事件
                this.style.webkitTransform = 'scale(' + currentScale + ')';
                console.log("当前缩放比例为:" + currentScale + ".");
            }
        });
    }
    //双击放大缩小
    swipeSelf.doubletap=function(){
        touch.on(swipeSelf.swipeContainer, 'doubletap','.img-div', function(ev){
            //console.log(ev.type);
            pinchSelf=this;
            currentScale=currentScale>1?2:1;
            if(currentScale==1){
                currentScale=2;
                swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.1s");//设置动画事件
                this.style.webkitTransform = 'scale(' + currentScale + ')';
            }else{
                currentScale=1;
                swipeSelf.swipeContainer.css("-webkit-transition","all ease 0.1s");//设置动画事件
                this.style.webkitTransform = 'scale(' + currentScale + ')';
            }
        });
    }
    //拖拽
    swipeSelf.dx=0;
    swipeSelf.dy=0;
    swipeSelf.drag=function(){
        touch.on(swipeSelf.swipeContainer, 'drag','.img-div', function(ev){
            if(currentScale>1){
                console.log("drag");
                dragSelf=this;
                swipeSelf.options.swipeLeft=false;
                swipeSelf.options.swipeRigth=false;
                swipeSelf.dx = swipeSelf.dx || 0;
                swipeSelf.dy = swipeSelf.dy || 0;
                console.log("当前x值为:" + swipeSelf.dx + ", 当前y值为:" + swipeSelf.dy +".");
                var offx = swipeSelf.dx + ev.x + "px";
                var offy = swipeSelf.dy + ev.y + "px";
                this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)"+" scale(" +currentScale +")";
            }
        });
        touch.on(swipeSelf.swipeContainer, 'dragend','.img-div', function(ev){
            console.log("dragend");
            swipeSelf.dx += ev.x;
            swipeSelf.dy += ev.y;
            swipeSelf.options.swipeLeft=true;
            swipeSelf.options.swipeRigth=true;
        });
    }
    //触发,查看大图
    swipeSelf.init=function(){
        //设置小图
        swipeSelf.listContainer.find(".img-min").width(minImageWidth);
        swipeSelf.listContainer.find(".img-min").height(minImageWidth);
        //添加绑定查看大图事件
        swipeSelf.listContainer.on("touchstart",".img-min",function(){
            bigIndex=$(this).index();
            swipeSelf.showBigImg();
        });
        swipeSelf.swipeRight();//右滑动
        swipeSelf.swipeLeft();//左滑动
        swipeSelf.pinche();//缩放
        swipeSelf.drag();//拖拽
        swipeSelf.doubletap();//双击放大缩小
    }
    //事件监听
    swipeSelf.listen=function(type,callback){
        swipeSelf[type]=callback;
    }
}