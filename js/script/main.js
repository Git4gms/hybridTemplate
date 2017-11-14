var app = {
    currentPageId  : '',
    backExitTimer : 0,
    initialize : function(){
        document.addEventListener("deviceready",  app.onDeviceReady, false);
        document.addEventListener('backbutton', app.gobackEvent);
        this.bindEvents();
        
    },
    onDeviceReady : function(){
        //app.bindEvents();
        
        
        
    },
    bindEvents : function(){
        $( document ).off('pageshow','[data-role="page"]').on( 'pageshow','[data-role="page"]', app.onPageShow);
        $( document ).off('pageshow','#indexPage').on( 'pageshow','#indexPage', appIndex.onPageShow);
        $( document ).off('pageshow','#loginPage').on( 'pageshow','#loginPage', appLogin.onPageShow);
        $( document ).off('pageshow','#signupPage').on( 'pageshow','#signupPage', appSignup.onPageShow);
    },
    onPageShow : function(){
        
        $( document ).off('click','.back-button').on( 'click','.back-button', app.gobackEvent);

        app.backExitTimer = 0;    
        app.currentPageId = $.mobile.activePage.attr('id');
    },
    gobackEvent : function(){
        
        if($.inArray(app.currentPageId, appConstant.arrExitOnBackClickPages) >= 0){   
           app.exitApp();
        }else{
            if (device.platform == "iOS") {
                history.go(-1);
            }else{
                navigator.app.backHistory();
            }
        }
    },
    exitApp : function(){
        if(app.backExitTimer == 0){
            app.backExitTimer = 1;
            appHelper.showToast('Press again to exit the app');
            setTimeout(function(){
                app.backExitTimer = 0;    
             },5000);
        }else{
            navigator.app.exitApp();
        }

    }



};

app.initialize();