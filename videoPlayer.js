DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Web.NavControls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");


DBFX.Web.Controls.VideoPlayer = function () {

    var vp = new DBFX.Web.Controls.Control("VideoPlayer");
    vp.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.VideoPlayerDesigner");
    vp.ClassDescriptor.Serializer = "DBFX.Serializer.VideoPlayerSerializer";
    vp.VisualElement = document.createElement("DIV");
    //通过正则表达式判断是否为手机端运行
    vp.isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    vp.fullScreenEvents = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];


    //是否自动播放 是/否
    vp.autoPlay = false;
    Object.defineProperty(vp, "AutoPlay", {
        get: function () {
            return vp.autoPlay==true ? "是":"否";
        },
        set: function (v) {
            vp.autoPlay = (v=="是") ? true:false;
            // vp.video.autoplay = (v=="是") ? true:false;
            // if(v=="是") vp.playVideo();
        }
    });

    //全屏是否旋转
    vp.isRotate = false;
    Object.defineProperty(vp, "IsRotate", {
        get: function () {
            return vp.isRotate==true ? "是":"否";
        },
        set: function (v) {
            vp.isRotate = (v=="是") ? true:false;
        }
    });

    //TODO:是否隐藏控制面板
    vp.autoHide = true;
    Object.defineProperty(vp, "AutoHide", {
        get: function () {
            return vp.autoHide;
        },
        set: function (v) {
            vp.autoHide = v;
        }
    });

    //控制面板是否在显示
    vp.ctlBarShow = true;

    //视频地址
    vp.videoUrl = "";
    Object.defineProperty(vp, "VideoUrl", {
        get: function () {
            return vp.videoUrl;
        },
        set: function (v) {
            vp.videoUrl = v;
            vp.videoSrc.src = v;
        }
    });

    vp.OnCreateHandle();
    vp.OnCreateHandle = function () {
        vp.VisualElement.className = "VideoPlayer";
        vp.VisualElement.innerHTML = "<div class=\"VideoPlayer_Wrapper\">"+
                                    "<video class='VideoPlayer_Video'>"+
                                    "<source class='VideoPlayer_VideoSrc' type=\"video/mp4\">"+
                                    "</video>"+
                                    "<div class='VideoPlayer_LoadError'><span>o(╥﹏╥)o:视频加载错误，请刷新页面重试！</span></div>"+
                                    "<div class='VideoPlayer_ControlBar'>" +
                                    "<div class='VideoPlayer_VideoPlay float'><img class='VideoPlayer_VideoPlayImg'/></div>"+
                                    "<div class='VideoPlayer_Slider float'><input class='VideoPlayer_SliderRange' type='range' value='0'></div>"+
                                    "<div class='VideoPlayer_Time float'><span class='currentTime'>00:00</span><span>/</span><span class='totalTime'>--:--</span></div>"+
                                    "<div class='VideoPlayer_Mute float'><img class='VideoPlayer_MuteImg'/></div>"+
                                    "<div class='VideoPlayer_Volume float'><input class='VideoPlayer_VolumeRange' type='range' min='0' max='100' value='50'></div>"+
                                    "<div class='VideoPlayer_FullScreen float'><img class='VideoPlayer_FullScreenImg'/></div>"+
                                    "</div>"+
                                    "<div class='VideoPlayer_CenterPlayBtn'><img class='VideoPlayer_CenterPlayImg'/></div>"+
                                    "</div>";
        vp.wrapper = vp.VisualElement.querySelector("div.VideoPlayer_Wrapper");
        vp.video = vp.VisualElement.querySelector("video.VideoPlayer_Video");
        vp.videoSrc = vp.VisualElement.querySelector("source.VideoPlayer_VideoSrc");
        vp.videoSrc.src = vp.videoUrl;
        vp.errorTip = vp.VisualElement.querySelector("div.VideoPlayer_LoadError");
        vp.controlBar = vp.VisualElement.querySelector("div.VideoPlayer_ControlBar");

        vp.centerBtnImg = vp.VisualElement.querySelector("img.VideoPlayer_CenterPlayImg");
        vp.playBtnImg = vp.VisualElement.querySelector("img.VideoPlayer_VideoPlayImg");
        vp.muteImg = vp.VisualElement.querySelector("img.VideoPlayer_MuteImg");
        vp.fullScreenImg = vp.VisualElement.querySelector("img.VideoPlayer_FullScreenImg");

        vp.curTimeSpan = vp.VisualElement.querySelector("span.currentTime");
        vp.totalTimeSpan = vp.VisualElement.querySelector("span.totalTime");


        //播放按钮
        vp.playBtn = vp.VisualElement.querySelector("div.VideoPlayer_VideoPlay");
        //中间大的播放按钮
        vp.centerBtn = vp.VisualElement.querySelector("div.VideoPlayer_CenterPlayBtn");
        //播放进度条
        vp.playRange = vp.VisualElement.querySelector("input.VideoPlayer_SliderRange");

        //静音按钮
        vp.muteBtn = vp.VisualElement.querySelector("div.VideoPlayer_Mute");
        //音量调节
        vp.volumeRange = vp.VisualElement.querySelector("input.VideoPlayer_VolumeRange");
        //音量
        vp.volume_ = vp.volumeRange.value;
        vp.video.volume = vp.volume_/100;

        //全屏按钮
        vp.fullScreenBtn = vp.VisualElement.querySelector("div.VideoPlayer_FullScreen");


        //TODO:1、根据是否自动播放 设置默认显示图片 2、集成到平台  地址需要更改
        // "Themes/" + app.CurrentTheme + "/Images/XXX.png"

        vp.centerBtnImg.src = "./assets/images/play-big.png";
        vp.playBtnImg.src = "./assets/images/play.png";
        vp.muteImg.src = "./assets/images/volume.png";
        vp.fullScreenImg.src = "./assets/images/fullscreen.png";

        // vp.centerBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play-big.png";
        // vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
        // vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";
        // vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen.png";


        //视频加载成功前 播放按钮不显示
        vp.centerBtn.className = "VideoPlayer_CenterPlayBtnHidden";
        vp.controlBar.className = "VideoPlayer_ControlBarHidden";

        //视频事件
        //loadstart
        vp.video.addEventListener("loadstart", function(){
            console.log("loadstart");
            console.log(vp.video.networkState);

        },false);

        vp.video.addEventListener("durationchange", function(){
            vp.errorTip.className = "VideoPlayer_LoadErrorHidden";
        },false);


        // 加载视频数据完成
        vp.video.addEventListener("loadedmetadata", function(){
            console.log("视频数据加载完成");

            //在视频数据加载完成后  添加鼠标移动事件
            vp.VisualElement.addEventListener("mousemove",function (e) {
                if(vp.timerId){
                    clearTimeout(vp.timerId);
                }
                vp.showControlBar(true);
                vp.timerId = setTimeout(vp.ticker, 10000);
            },false);

            //视频加载成功 播放按钮显示
            if(!vp.isPhone){
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
                vp.controlBar.className = "VideoPlayer_ControlBar";
            }

            vp.totalTimeSpan.innerText = vp.getTimeBySecond(vp.video.duration);

            if(vp.autoPlay){
                vp.playVideo();
            }
        });

        //视频播放时间更新
        vp.video.addEventListener("timeupdate", function(){

            var val = (100 / vp.video.duration) * vp.video.currentTime;
            vp.playRange.value = val;
            //更新当前时间
            vp.curTimeSpan.innerText = vp.getTimeBySecond(vp.video.currentTime);
            vp.playRange.style.background = 'linear-gradient(to right, #059CFA 0%, #059CFA ' + val +'%, white '+ val +'%,white)';
        });

        //视频播放结束
        vp.video.addEventListener("ended", function(){
            vp.video.pause();
            vp.video.currentTime = 0;
            if(!vp.isPhone){
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
            }

            vp.playRange.style.background = "white";
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
        });



        //事件处理
        //播放按钮
        vp.playBtn.onmousedown = vp.playVideo;
        vp.centerBtn.onmousedown = vp.playVideo;

        //拖动进度条结束
        vp.playRange.addEventListener("change", function(){
            var time = vp.video.duration * (this.value / 100);
            vp.video.currentTime = time;
            vp.curTimeSpan.innerText = vp.getTimeBySecond(time);

        });

        //进度条
        vp.playRange.addEventListener("input", function(){

            var time = vp.video.duration * (this.value / 100);
            vp.curTimeSpan.innerText = vp.getTimeBySecond(time);

            vp.playRange.style.background = 'linear-gradient(to right, #059CFA 0%, #059CFA ' + this.value +'%, white '+ this.value +'%,white)';
        });

        //静音按钮
        vp.muteBtn.addEventListener("click", function(){

            if(vp.video.muted){
                vp.video.muted = false;
                vp.volumeRange.value = vp.volume_;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";

            }else{
                vp.video.muted = true;
                vp.volumeRange.value = 0;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/mute.png";
            }
        });

        //音量调节
        vp.volumeRange.addEventListener("input", function(){
            console.log(this.value);
            vp.volume_ = this.value;
            vp.video.volume = this.value/100;

            if(this.value == 0){
                vp.video.muted = true;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/mute.png";
            }else {
                vp.video.muted = false;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";
            }
        });

        //全屏切换按钮点击
        vp.fullScreenBtn.addEventListener("click",function () {

            if(!vp.isFullScreen()){

                vp.origWidth = vp.VisualElement.offsetWidth;
                vp.origHeight = vp.VisualElement.offsetHeight;
                // go full-screen
                if (vp.VisualElement.requestFullscreen) {
                    vp.VisualElement.requestFullscreen();
                } else if (vp.VisualElement.webkitRequestFullscreen) {
                    vp.VisualElement.webkitRequestFullscreen();
                } else if (vp.VisualElement.mozRequestFullScreen) {
                    vp.VisualElement.mozRequestFullScreen();
                } else if (vp.VisualElement.msRequestFullscreen) {
                    vp.VisualElement.msRequestFullscreen();
                }


            }else {
                // exit full-screen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }

            }

        },false);

    }

    vp.showControlBar = function (isShow) {
        if(!vp.isPhone){
            vp.controlBar.className = isShow ? "VideoPlayer_ControlBar" : "VideoPlayer_ControlBarHidden";
        }

    }

    vp.ticker = function(){
        //autoHide为true并且正在播放视频
        if(vp.autoHide && !vp.video.paused){
            vp.showControlBar(false);
        }
        if(vp.timerId){
            clearTimeout(vp.timerId);
        }
    };

    vp.timerId = setTimeout(vp.ticker, 10000);


    //播放/暂停视频
    vp.playVideo = function () {
        console.log("播放视频");
        console.log(vp.video.paused);
        if(vp.video.paused){
            vp.video.play();
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/pause.png";
            vp.centerBtn.className = "VideoPlayer_CenterPlayBtnHidden";

        }else {
            vp.video.pause();
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
            if(!vp.isPhone){
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
            }

        }
    }

    //判断是否全屏
    vp.isFullScreen = function(){
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
    };

    //相应进入全屏事件
    vp.fullScreenEvents.forEach(function (eventType) {
        document.addEventListener(eventType, function(event){

            if(vp.isFullScreen()){
                var cltHeight = vp.isRotate && vp.isPhone ? window.screen.width : window.screen.height;
                var cltWidth = vp.isRotate && vp.isPhone ? window.screen.height : window.screen.width;

                if(vp.isRotate && !vp.VisualElement.classList.contains("rotate90") && vp.isPhone){
                    vp.VisualElement.classList.add("rotate90");
                }

                vp.VisualElement.style.height = cltHeight + "px";
                vp.VisualElement.style.width = cltWidth + "px";

                vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen_off.png";
            }else{

                if(vp.isRotate && vp.VisualElement.classList.contains("rotate90")){
                    vp.VisualElement.classList.remove("rotate90");
                }
                vp.VisualElement.style.height = vp.origHeight + "px";
                vp.VisualElement.style.width = vp.origWidth + "px";

                vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen.png";
            }

        },false);

    });

    //获取时间秒
    vp.getTimeBySecond = function (second) {
        var hour = parseInt(second / (60* 60));
        var minute = parseInt((second/60) % 60);
        var second = parseInt(second % 60);
        return (hour > 0 ?((hour < 10 ? "0" + hour:hour) + ":") : "") + (minute < 10 ? "0" + minute:minute) + ":" + (second < 10 ? "0" + second:second);
    }

    vp.OnCreateHandle();
    return vp;
}

DBFX.Serializer.VideoPlayerSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("AutoPlay", c.AutoPlay, xe);
        DBFX.Serializer.SerialProperty("IsRotate", c.IsRotate, xe);
        DBFX.Serializer.SerialProperty("VideoUrl", c.VideoUrl, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("AutoPlay", c, xe);
        DBFX.Serializer.DeSerialProperty("IsRotate", c, xe);
        DBFX.Serializer.DeSerialProperty("VideoUrl", c, xe);
    }
}

DBFX.Design.ControlDesigners.VideoPlayerDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/VideoPlayerDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "视频播放器设置";
    return obdc;
}