var app = {
db : null,
notificationCount: 0,
fileUploadLimit: 1048576,
fileUploadLimit1MB: 1048576,
listCountLimit: helper.getPageLimit(668, 111),
phoneNumber: null,
pin: null,
requestCancellationTime: null,
coldStartNotification: null,
scrollPos: 0,
announcementId: 0,
appVersion: 0,
pushNotificationDates: '',
currentPageId : '',
emergencyBackId: '',
nonetworkLoaded: 0,
dbVersion: 0,
isUpdated: true,
notificationType: '',
notificationDate: '',
neo: '754557086446',
dev: '643155073861',
live: '813704343837',
loggedInUserData : '',   
IsSecretary : '',   
activeMobiscrollElement : [],   
logoutIntertval : '',   
timeZonePopShow : 1,   
departmentListObj : {},    
    // Neo Server



 //SAA Sharjah Server
//apiPath: 'https://ema.sharjahairport.ae/ExternalService.svc/',
//fileUploadPath: 'https://ema.sharjahairport.ae/Helper/FileUploader.ashx',
//fileDownloadPath: 'https://ema.sharjahairport.ae/Helper/FileDownloader.ashx',
//appDownload: 'https://ema.sharjahairport.ae/apps/index.html',    



//SAA Sharjah Server Dev
//apiPath: 'https://ema.sharjahairport.ae/dev/ExternalService.svc/',
//fileUploadPath: 'https://ema.sharjahairport.ae/dev/Helper/FileUploader.ashx',
//fileDownloadPath: 'https://ema.sharjahairport.ae/dev/Helper/FileDownloader.ashx',
//appDownload: 'https://ema.sharjahairport.ae/dev/apps/index.html',
//SAA Sharjah Server Dev
//apiPath: 'http://192.168.1.162:8087/ExternalService.svc/',  
//fileUploadPath: 'http://192.168.1.162:8087/Helper/FileUploader.ashx',
//fileDownloadPath: 'http://192.168.1.162:8087/Helper/FileDownloader.ashx',
//appDownload: 'http://192.168.1.162:8087/apps/index.html',

//Local Server
apiPath: 'http://166.62.44.241:8879/ExternalService.svc/',
fileUploadPath: 'http://166.62.44.241:8879/Helper/FileUploader.ashx',
fileDownloadPath: 'http://166.62.44.241:8879/Helper/FileDownloader.ashx',
appDownload: 'http://166.62.44.241:8879/apps/index.html',

    
test: function () {
    //alert(1); 
},
    
initialize: function () {
    document.addEventListener("deviceready", app.onDeviceReady, false);
	document.addEventListener("pause", app.pause, false);
    document.addEventListener("resume", app.resume, false);
    if (helper.isLocalPc()) {
        app.bindEvents();
    }
	
},
language: (function () {
           if (helper.isVarSet(localStorage.language)) {
           return localStorage.language;
           } else {
           return null;
           }
           })(),
staffCode: (function () {
            if (helper.isVarSet(localStorage.staffCode)) {
            return localStorage.staffCode;
            } else {
            return null;
            }
            })(),
staffName: null,
staffNameEn: null,
departmentCode: null,
roleId: null,
IsApprover: 0,
deviceUniqueId: (function () {
                 if (!helper.isLocalPc()) {
                 return null;
                 } else {
                 //return '8e17581746d76b1e';
                 //return '8c76c8210f81259f';
                 return '8c76c8210f81259g';
                 }
                 })(),
lastLoginDate: null,
StartIndex: 0,
Count: 0,
DateOfJoining: null,
DateOfBirth: null,
getInitialCount: function () {
    var winHeight = $(window).height();
    var notifCount = (winHeight / 60);
    app.Count = parseInt(notifCount);
    app.StartIndex = 0;
    if (helper.isVarSet($.mobile.activePage)) {
        if ($.mobile.activePage.attr('id') != 'dashboard') {
            data = {
            StartIndex: 0,
            EndIndex: 0,
            staff: {
            StaffCode: app.staffCode
            }
            };
            
            app.generateAjax(data, 'GetNotificationCount', app.notificationCountResponse);
        }
    }
},
notificationCountResponse: function (responseData) {
    if (helper.isVarSet(responseData)) {
        if (helper.isVarSet(responseData.ApiResponse)) {
            //console.log(responseData.ApiResponse.StatusCode+'getInitialCount--3->'+JSON.stringify(responseData));
            if (responseData.ApiResponse.StatusCode == 1) {
					
				if(responseData.CommonDetails.NotificationCount != undefined && responseData.CommonDetails.NotificationCount != '' && responseData.CommonDetails.NotificationCount != null){
					app.notificationCount = parseInt(responseData.CommonDetails.NotificationCount);
				}else{
					app.notificationCount = parseInt(0);
				}
				
				if(app.notificationCount > 0){
					$('.notification_count').html(app.notificationCount);
					if (!helper.isLocalPc()) {
						if(hasActualValue(notification.pushNotification)){
							notification.pushNotification.setApplicationIconBadgeNumber(function() {
								console.log('success');
							}, function() {
								console.log('error');
							}, app.notificationCount);
						}
					}
					$('.notification_count').show()
				}else{
					$('.notification_count').hide()
					if (!helper.isLocalPc()) {
						if(hasActualValue(notification.pushNotification)){
							notification.pushNotification.setApplicationIconBadgeNumber(function() {
								console.log('success');
							}, function() {
								console.log('error');
							}, app.notificationCount);
						}
					}
				}
                
            }
        }
    }
},
fileDbInsert: function (reqst){
	var count1=0;
	var array_length=deviceMedia.saveName.length;

	$.each(deviceMedia.saveName, function (index, value) {
		dateObj = new Date();
		timeStamp = dateObj.getTime();
		
		
		app.db.transaction(function (tx) {  
			if(deviceMedia.saveName[index] != null){
				tx.executeSql("INSERT INTO complaint_attachments ( attached_id,staff_code , file_path, file_orgname, file_uniquename , request_type , mime_type , is_updated , page_Id) VALUES (?,?,?,?,?,?,?,?,?)", [timeStamp,app.staffCode,deviceMedia.mediaSrc[index],deviceMedia.fileName[index],deviceMedia.saveName[index],reqst.type,deviceMedia.mimeType,'0',app.currentPageId],function(tx,rs){
					count1=count1+1;
					if(count1==array_length){
						helper.initFileUpload(reqst);
					}
				}) 
			}
			else{
				count1=count1+1;
				if(count1==array_length){
					helper.initFileUpload(reqst);
				}
			}			
		});
	})
}
,
createtable: function(){
 app.db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS complaint_attachments (attached_id TEXT NULL,staff_code TEXT NULL, file_path TEXT NULL, file_orgname TEXT NULL, file_uniquename TEXT NULL, request_type TEXT NULL, mime_type TEXT NULL, is_updated TEXT NULL,page_Id TEXT NULL)');
  }, function(error) {
    console.log('Transaction ERROR: ' + error.message);
  }, function() {
    console.log('Populated database OK');
  });
},
onDeviceReady: function () {
	//screen.lockOrientation('portrait');
    app.pinTimedOut = 0;
	
    //cordova.plugins.backgroundMode.enable();
	
	app.bindEvents();
    if (!helper.isLocalPc()) {
        notification.deviceIdInterval = setInterval(function () {
                                                    notification.getDeviceID();
                                                    }, 20000);
    }
    document.addEventListener('backbutton', app.backButtonHandler);
    $(document).off('click', '.btncancel').on('click', '.btncancel', app.backButtonHandler);
    cordova.getAppVersion(function (version) {
                          app.appVersion = version;
                          });
    
    if (!helper.isLocalPc()) {
        app.deviceUniqueId = device.uuid;
    } else {
       // app.deviceUniqueId = '8e17581746d76b1e';
       // app.deviceUniqueId = '8c76c8210f81259f';
        app.deviceUniqueId = '8c76c8210f81259g';
    }
    //app.disp_loading(1);
    
    if (typeof localStorage.language == 'undefined') {
        //app.pageNavigator('index');
        if (!helper.isLocalPc()) {
            if (device.platform.toLowerCase() === 'ios')
                navigator.splashscreen.hide();
        }
		app.hide_loading();
    } else {
        //window.onbeforeunload = null;
        app.language = localStorage.language;
        if (app.language == "English" || app.language == "Arabic") {
            if ((!helper.isVarSet(localStorage.staffCode)) || localStorage.staffCode.trim() == '' || localStorage.staffCode == 'NaN') {
                app.pageNavigator('authentication');
            } else {
                var staffCode = localStorage.staffCode;
                authentication.checkActivation(staffCode, false, false);
            }
        }
    }
},
checkAppVersion: function () {
    if (app.appVersion != 0) {
        var data = {
            "KeyName": "AppVersion"
        };
        app.generateAjax(data, 'GetGeneralSettings', app.versionResponse);
    }
},
versionResponse: function (responseData) {
    if (responseData != null) {
        if (responseData.ApiResponse.StatusCode == 1) {
            if (responseData.GeneralSettingList.length > 0) {
                app.dbVersion = responseData.GeneralSettingList[0].KeyValue;
              
                var dbVersion = app.dbVersion.replace(/\./g, '');
                var appVersion = app.appVersion.replace(/\./g, '');
				localStorage.appIdleTimeout = 600;
				if(hasActualValue(responseData.AppIdleTimeout)){
					localStorage.appIdleTimeout = parseInt(responseData.AppIdleTimeout) * 60;
				}
                
                if (parseInt(dbVersion) <= parseInt(appVersion)) {
                    //Do nothing
                    app.isUpdated = true;
                } else if (parseInt(dbVersion) > parseInt(appVersion)) {
                    //Update required
                    app.isUpdated = false;
                    app.showUpdatePopup();
                }
            } else {
            }
        } else {
        }
    } else {
    }
},
showUpdatePopup: function () {
    if (app.isUpdated) {
        app.hide_loading();
    } else {
        //app.showPopup(app_messages.retryAfterSometime(app.language), "javascript: $('.popupbg_forgot.authenticateions').fadeOut();", ".popupbg_forgot.authenticateions");
        
        var popup = '<div class="popupbg_forgot authenticateions" id="appUpdatePop">' +
        '<div class="forgotmsg_wrapper">' +
        '<p id="txtMessage">' + app_messages.updateApp(app.language) + '</p>' +
        '<div class="popupbtn_wrapper">' +
        '<a id="redirectUrl" href="javascript:  setTimeout(function () {navigator.app.exitApp();},1500);window.open(\'' + app.appDownload + '\', \'_system\');">' +
        '<button data-role="none">' + app_messages.continues(app.language) + '</button></a>' +
        '</div>' +
        '</div>' +
        '</div>';
        
        $("#appUpdatePop").remove();
        $(popup).appendTo('[data-role="page"].ui-page-active');
        app.hide_loading();
        $('#appUpdatePop').fadeIn('slow');
    }
},
pause: function () {
	if (!helper.isLocalPc()) {
	   if (device.platform.toLowerCase() === 'ios'){
		$(dashboard.apiCalls).each(function(key,val){
			val.abort();
		});
		dashboard.apiCalls = [];
	   }
	}
	var MinutesLater = new Date();
	localStorage.idleTimeoutTime = parseInt(MinutesLater.setMinutes(MinutesLater.getMinutes() + (localStorage.appIdleTimeout/60)));
	
},
logOutIdleState : function(){
	
	pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
	if(app.logoutIntertval != undefined && app.logoutIntertval != '' && app.logoutIntertval != null){
		clearInterval(app.logoutIntertval);
	}
	if(localStorage.idleStateTimer != undefined && localStorage.idleStateTimer != '' && localStorage.idleStateTimer != null){
		localStorage.idleStateTimer = 0;
	}
	if(app.appIdleTimeout != undefined && app.appIdleTimeout != '' && app.appIdleTimeout != null){
		localStorage.appIdleTimeout = 500;
	}
	
	if($.inArray(currentPageId, pagesBeforeLogin) < 0){
		app.logoutIntertval = setInterval(function(){ 
				
				if(parseInt(localStorage.idleStateTimer)  < localStorage.appIdleTimeout){
					localStorage.idleStateTimer = parseInt(parseInt(localStorage.idleStateTimer) + 1);
				}else{
					
					app.idleRedirect();
					clearInterval(app.logoutIntertval);
					app.logoutIntertval = '';
				}
		}, 1000);
	}
},
idleRedirect : function(){
	pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
	if($.inArray(currentPageId, pagesBeforeLogin) < 0){
		app.pageNavigator('login');
	}
},
resume: function () {
	app.timeZonePopShow = 1;
	if(localStorage.idleTimeoutTime != undefined){
		curDaateTime = new Date().getTime();
		if(localStorage.idleTimeoutTime < curDaateTime){
			pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
			if($.inArray(currentPageId, pagesBeforeLogin) < 0){
				app.idleRedirect();
				app.logoutIntertval = '';
			
			}
		}
		localStorage.removeItem('idleTimeoutTime');
	}
	if (!helper.isLocalPc()) {
	   if (device.platform.toLowerCase() === 'ios'){
			if(app.currentPageId == 'dashboard'){
				if($('#swip-announcement .owl-item').length != undefined && $('#swip-announcement .owl-item').length > 0){
					
				}else{
					setTimeout(function(){
						dashboard.announcementLoaded = 0;
						dashboard.fetchAnnouncement(dashboard.endIndex);
					},1000);
				}
			}
	   }
	}
   app.checkAppVersion();
   
},
    /**
     * Function to split a phone/email
     * @param {string} value - input string eg:sequence of phn no seprated by |
     * @param {string} format - tel / mailto
     * @param {string} ipSeparator - separator in input (|)
     * @param {string} opSeparator - separator in output (,)
     * @param {int} firstn - limit with first n values
     * @returns {String}
     */
getFormatLink: function (value, format, ipSeparator, opSeparator, firstn) {
    if (helper.isVarSet(value) && value !== '') {
        var arr = value.split(ipSeparator);
        var formatedStr = '';
        var limit = 0;
        if (arr.length > 0) {
            limit = (helper.isVarSet(firstn)) ? parseInt(firstn) - 1 : arr.length - 1;
            $.each(arr, function (index, value) {
                   if (index < limit) {
                   formatedStr = formatedStr + '<a href="' + format + ':' + value.replace(/\s+/g, '') + '" >' + value.replace(/;/g, '<br/>').replace(/,/g, '<br/>') + '</a>' + opSeparator;
                   } else {
                   formatedStr = formatedStr + '<a href="' + format + ':' + value.replace(/\s+/g, '') + '" >' + value.replace(/;/g, '<br/>').replace(/,/g, '<br/>') + '</a>';
                   }
                   if (index == limit) {
                   return false;
                   }
                   });
        }
        return formatedStr;
    } else {
        return "";
    }
},
backButtonHandler: function (event) {
   // console.log("backButtonHandler"+$('#notify_list').is(':visible'));
    if ($('#notify_list').is(':visible')) {
        $('.notification_listwrapper').hide();
        $('#notify_list').html('');
    } else if ($('#left-panel').hasClass('ui-panel-open')) {
        $('#left-panel').panel("close");
    } else {
        var confirm = '<div class="popupbg_forgot" id="confirmBox">' +
        '<div class="forgotmsg_wrapper">' +
        '<p>' + app_messages.exitAppConfirm(app.language) + '</p>' +
        '<div class="popupbtn_wrapper" style="width:50%;">' +
        '<a id="cancelUrl" href="javascript: $(\'#confirmBox\').hide();"><button data-role="none">' + app_messages.confirmNo(app.language) + '</button></a>' +
        '</div>' +
        '<div class="popupbtn_wrapper" style="width:50%">' +
        '<a id="confirmUrl" href="javascript: app.exit();"><button data-role="none">' + app_messages.confirmYes(app.language) + '</button></a>' +
        '</div>' +
        '</div>' +
        '</div>';
        
        event.preventDefault();
        var pageId = $('[data-role="page"].ui-page-active').attr('id');
        if (pageId == "langhome" || pageId == "dashboard" || pageId == "login" ||
            pageId == "authentication" || pageId == "forgot_password" || pageId == "verify_otp" ||
            pageId == "pin_setup" || pageId == "nonetwork") {
            
            $(confirm).appendTo('[data-role="page"].ui-page-active');
            $('#confirmBox').fadeIn('slow');
            
        } else {
            $('#btnBackPage').trigger("touchstart");
        }
    }
},
exit: function () {
    navigator.app.exitApp();
},
isUploadVerified: function () {
    var fileCount = $.grep(deviceMedia.fileName, function (elem) {
                           return elem != null;
                           }).length;
    //console.log('fileCount--->>>'+fileCount);
    if (fileCount <= 5) {
        return true;
    } else {
        return false;
    }
},
getCensoredPhone: function (phone) {
    if (helper.isVarSet(phone)) {
        if (phone.trim() != '') {
            len = phone.trim().length;
            var xvar = '';
            for (var i = 0; i < len - 4; i++) {
                xvar = xvar + 'X';
            }
            return (xvar + phone.substring(len - 4, len));
        } else {
            return '';
        }
    } else {
        return '';
    }
},
minutesToHours: function (val) {
    var mins = val % 60;
    if (mins < 10) {
        mins = '0' + mins;
    }
    var hrs = (val - mins) / 60;
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    return (hrs + ':' + mins);
},
disp_loading: function (part) {
    $('#loadmoreajaxloader').hide();
    if (!helper.isVarSet(part)) {
        $('[data-role="main"]').hide();
        $("[data-msg='title']").hide();
    } else if(part == 2) {
    	$(".directory_container").hide();
    }
	$.mobile.loading('show');
},
hide_loading: function () {
	if(request.filterPage != undefined && request.filterPage == 1){
		$('[data-role="main"]').show();
		$("[data-msg='title']").show();
		$(".directory_container").show();
		setTimeout(function () {
				  $.mobile.loading('hide');
				  request.filterPage = 0;
				  app.showSearchBox();
	   }, 1500);
	}else{
		setTimeout(function () {
				   $('[data-role="main"]').show();
				   $("[data-msg='title']").show();
				   $(".directory_container").show();
				   $.mobile.loading('hide');
				   }, 800);
	}

},
bindEvents: function () {
    //app.getInitialCount();
	
		if (!helper.isLocalPc()) {
  app.db = window.sqlitePlugin.openDatabase({name: 'newdatabase', location: 'default'});
  app.createtable();
  
 }
 else{
  app.db = openDatabase('newdatabase', '1.0', 'database for saa', 2*1024*1024)
  app.createtable();
  
 }

    $(document).off('pageinit', '[data-role="page"]').on('pageinit', '[data-role="page"]', function () {
		
				   app.disp_loading();
                   $.mobile.defaultHomeScroll = 0;
					$(".progress_wrapper").removeClass("temp_model");
                   $(".login_field_container").removeClass("pinvalidator");
                   });
    $(document).off('pagebeforeshow', '#login').on('pagebeforeshow', '#login', login.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#pin_setup').on('pagebeforeshow', '#pin_setup', pinSetup.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#announcement_view').on('pageshow', '#announcement_view', announcement.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#verify_otp').on('pagebeforeshow', '#verify_otp', verifyOTP.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#training_course').on('pagebeforeshow', '#training_course', trainingCourse.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#forgot_password').on('pagebeforeshow', '#forgot_password', forgotPassword.pagebeforeshow_callback);
    $(document).off('pagebeforeshow', '#civil_service_law_view').on('pagebeforeshow', '#civil_service_law_view', civilServiceLawView.pagebeforeshow_callback);
    $(document).off('pageshow', '#settings').on('pageshow', '#settings', settings.pageshow_callback);
    $(document).off('pageshow', '#test').on('pageshow', '#test', function(){
	
		app.hide_loading();
	});
	$(document).off("pagecreate").on("pagecreate",function(event,data){
		app.disp_loading();
	});
	


   $(document).off('pageshow', '#langhome').on('pageshow', '#langhome', function () {
                   app.disp_loading();
                   });
    $(document).off('pageshow', '#langhome').on('pageshow', '#langhome', function () {
				setTimeout(function(){
					app.hide_loading();
				 
				 },1000);
				 
                   if (!helper.isLocalPc()) {
                   if (device.platform.toLowerCase() === 'ios')
                   navigator.splashscreen.hide();
                   }
   });
   $(document).off('pagebeforeshow', '[data-role="page"]').on('pagebeforeshow', '[data-role="page"]', function () {
	
	   
   });
   
    $(document).off('pageshow', '[data-role="page"]').on('pageshow', '[data-role="page"]', function () {
	
		app.timeZonePopShow = 1;
		if(hasActualValue(app.notificationCount)){
			if(app.notificationCount > 0){
				$('.notification_count').html(app.notificationCount);
				$('.notification_count').show();
			
			}else{
				$('.notification_count').hide();
			}
		}else{
			$('.notification_count').hide();
		}
		app.currentPageId = $.mobile.activePage.attr('id');
		window.addEventListener('keyboardDidHide', function () {
			if(!helper.isLocalPc()){
				if(device.platform != "Android"){
					if(app.currentPageId == "profile_edit"){
						$('div[data-role="header"]').fadeIn(500);
					}
				}
			}
		});
		
			
	
		dashboard.announcementLoaded = 0;
	
		currentPageId = $.mobile.activePage.attr('id');
		if($('#'+app.currentPageId+' .uploadInfo:not(.exemptedInfo)').length > 0){
			$('#'+app.currentPageId+' .uploadInfo:not(.exemptedInfo)').html(appLabel.uploadSizeLimit(app.language));
		}
		setTimeout(function(){
			if(currentPageId != "nonetwork"){
				app.disp_loading();
				app.nonetworkLoaded = 0;
			}
			
		},1);
		$(document).off("click",'body').on("click",'body',function(){
			localStorage.idleStateTimer = 0;
			app.logOutIdleState();
		
		
		});
	  
		$(document).off("click",'a').on("click",'a',function(){
			ss = $(this).attr('href');

		   
			if(ss != undefined){
				if (ss.toLowerCase().indexOf(".html") >= 0){
					if($(this).hasClass('triggerFromApp')){
						app.disp_loading();
					}
				}
			}
		});
	
		if (navigator.userAgent.match(/iPhone/g)) {
			var iphoneHeight = 667;
			var iphoneWidth = 375;
			if (iphoneWidth === 375 && iphoneHeight === 667) {
				$('.header_wrapper').addClass('iPhone6Header');
			}
		}
		var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
		if(isAndroid) {
			$('.header_wrapper').addClass('androidHeader');
			$('.badge_row').addClass('androidBadgeRow');
			$('.menuNotificationIcon').addClass('androidMenuNotificationIcon');
		}
		
		pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
		
			
		
		if (!helper.checkNetworkConnection()) {
	    } else {
			if(currentPageId != 'nonetwork'){
				if($.inArray(currentPageId, pagesBeforeLogin) >= 0){
				
				
					localStorage.lastPage = 'index';
					if (!helper.isLocalPc()) {
						setTimeout(function(){
							if(hasActualValue(notification.pushNotification)){
								notification.pushNotification.setApplicationIconBadgeNumber(function() {
									console.log('success');
								}, function() {
									console.log('error');
								}, 0);
							}
						},2000);
					}
				}else{
					if(app.requestCancellationTime == undefined || app.requestCancellationTime == null || app.requestCancellationTime == ''){
						dashboard.fetchCancelTimeout();
					}
					
				
				
					var path = window.location.pathname;
					var page_name = path.split("/").pop();
					var page = page_name.split(".").slice(0, 1).pop();
					localStorage.lastPage = page;
				
				}
				localStorage.idleStateTimer = 0;
				app.logOutIdleState();
			}
		}
		
		$(document).off('keyup','.allowOnlyDigits').on('keyup',".allowOnlyDigits",function (e) {
		
			ss = $(this).val();
			ss1 = ss.replace(/[^\d]+/gi, "");	
			$(this).val(ss1);
		});
	
					if($.mobile.activePage.attr('id') == 'dashboard'){
						//app.hide_loading();
						
					}
					app.checkAppVersion();
                   $('[data-role="datebox"]').parent().css("border-style", "none");
                   $('.ui-icon-calendar,.ui-icon-clock').css('width', '0px');
                   //app.checkAppVersion();
                   //app.customDotDotDot(".sialogo_wrapper span", ".sialogo_wrapper");//TEST
    });
    $(document).off('pageshow', '#profile_edit').on('pageshow', '#profile_edit', profileEdit.pageshow_callback);
    $(document).off('pageremove', '#profile_edit').on('pageremove', '#profile_edit', profileEdit.pageremove_callback);
    $(document).off('pageshow', '#myprofile').on('pageshow', '#myprofile', myProfile.pageshow_callback);
    $(document).off('pageshow', '#dashboard').on('pageshow', '#dashboard', dashboard.pageshow_callback);
    $(document).off('pageshow', '#memos_circulars_view').on('pageshow', '#memos_circulars_view', memoView.pageshow_callback);
    $(document).off('pageshow', '#change_pin').on('pageshow', '#change_pin', changePin.pageshow_callback);
    $(document).off('pageshow', '#add_grievance').on('pageshow', '#add_grievance', addGrievance.pageshow_callback);
    $(document).off('pageshow', '#privacy_policy').on('pageshow', '#privacy_policy', populateCMSPageContent.pageshow_callback);
    $(document).off('pageshow', '#about').on('pageshow', '#about', populateCMSPageContent.pageshow_callback);
    $(document).off('pageshow', '#holiday_list').on('pageshow', '#holiday_list', populateCMSPageContent.pageshow_callback);
    $(document).off('pageshow', '#anniversary').on('pageshow', '#anniversary', populateCMSPageContent.pageshow_callback);
    $(document).off('pageshow', '#ibtikari_form').on('pageshow', '#ibtikari_form', ibtikari.pageshow_callback);
    $(document).off('pageshow', '#request').on('pageshow', '#request', request.pageshow_callback);
    $(document).off('pageshow', '#late_application_form').on('pageshow', '#late_application_form', lateApplicationForm.pageshow_callback);
    $(document).off('pageshow', '#timeoff_permission').on('pageshow', '#timeoff_permission', permission.pageshow_callback);
    $(document).off('pageshow', '#request_airline_rebate').on('pageshow', '#request_airline_rebate', applyAirlineRebate.pageshow_callback);
    $(document).off('pageshow', '#request_certificate').on('pageshow', '#request_certificate', applyCertificate.pageshow_callback);
    $(document).off('pageshow', '#leave_apply_form').on('pageshow', '#leave_apply_form', applyLeave.pageshow_callback);
    $(document).off('pageshow', '#request_details').on('pageshow', '#request_details', requestDetails.pageshow_callback);
    $(document).off('pageshow', '#authentication').on('pageshow', '#authentication', authentication.pageshow_callback);
    $(document).off('pageshow', '#training_course').on('pageshow', '#training_course', trainingCourse.pageshow_callback);
    $(document).off('pageshow', '#training_courses_view').on('pageshow', '#training_courses_view', trainingView.pageshow_callback);
    $(document).off('pageshow', '#training_details').on('pageshow', '#training_details', trainingDateDetails.pageshow_callback);
    $(document).off('pageshow', '#request_for_training').on('pageshow', '#request_for_training', requestTraining.pageshow_callback);
    $(document).off('pageshow', '#announcement').on('pageshow', '#announcement', announcementListView.pageshow_callback);
    $(document).off('pageshow', '#request_leave').on('pageshow', '#request_leave', requestLeave.pageshow_callback);
    $(document).off('pageshow', '#request_salary_list').on('pageshow', '#request_salary_list', requestSalary.pageshow_callback);
    $(document).off('pageshow', '#request_late_application_list').on('pageshow', '#request_late_application_list', requestLateApplication.pageshow_callback);
    $(document).off('pageshow', '#request_sponsor_list').on('pageshow', '#request_sponsor_list', requestSponsor.pageshow_callback);
    $(document).off('pageshow', '#request_airline_rebate_list').on('pageshow', '#request_airline_rebate_list', requestAirline.pageshow_callback);
    $(document).off('pageshow', '#request_light_driving_list').on('pageshow', '#request_light_driving_list', requestDrivingLight.pageshow_callback);
    $(document).off('pageshow', '#request_renewal_license_list').on('pageshow', '#request_renewal_license_list', requestDrivingRenewal.pageshow_callback);
    $(document).off('pageshow', '#request_vehicle_registration_list').on('pageshow', '#request_vehicle_registration_list', requestRegistrationLetter.pageshow_callback);
    $(document).off('pageshow', '#request_vehicle_registration_renewal_list').on('pageshow', '#request_vehicle_registration_renewal_list', requestRegistrationRenewal.pageshow_callback);
    $(document).off('pageshow', '#request_haj_list').on('pageshow', '#request_haj_list', requestHaj.pageshow_callback);
    $(document).off('pageshow', '#request_omrah_list').on('pageshow', '#request_omrah_list', requestOmrah.pageshow_callback);
    $(document).off('pageshow', '#request_for_approval').on('pageshow', '#request_for_approval', staffRequests.pageshow_callback);
    $(document).off('pageshow', '#staff_request_details').on('pageshow', '#staff_request_details', staffRequestView.pageshow_callback);
    $(document).off('pageshow', '#permissions').on('pageshow', '#permissions', requestPermission.pageshow_callback);
    $(document).off('pageshow', '#memos_circulars').on('pageshow', '#memos_circulars', memoCircular.pageshow_callback);
    $(document).off('pageshow', '#employee_directory2').on('pageshow', '#employee_directory2', employeeDirectory.pageshow_callback);
    $(document).off('pageshow', '#civil_service_law').on('pageshow', '#civil_service_law', civilServiceList.pageshow_callback);
    $(document).off('pageshow', '#duty_roster').on('pageshow', '#duty_roster', dutyRoster.pageshow_callback);
    $(document).off('pageshow', '#duty_roster_list').on('pageshow', '#duty_roster_list', dutyRosterList.pageshow_callback);
    $(document).off('pageshow', '#time_attendance').on('pageshow', '#time_attendance', timeAttendance.pageshow_callback);
    $(document).off('pageshow', '#nonetwork').on('pageshow', '#nonetwork', nonetwork.pageshow_callback);
    $(document).off('pageshow', '#grievance_list').on('pageshow', '#grievance_list', grievanceList.pageshow_callback);
    $(document).off('pageshow', '#ibtikari_list').on('pageshow', '#ibtikari_list', ibtikariList.pageshow_callback);
    $(document).off('pageshow', '#profile_list').on('pageshow', '#profile_list', profileEditList.pageshow_callback);
    $(document).off('pageshow', '#survey').on('pageshow', '#survey', survey.pageshow_callback);
    $(document).off('pageshow', '#survey_list').on('pageshow', '#survey_list', surveyList.pageshow_callback);
    $(document).off('pageshow', '#emergency').on('pageshow', '#emergency', emergency.pageshow_callback);
    $(document).off('pageshow', '#request_duty_resumption').on('pageshow', '#request_duty_resumption', requestDutyresum.pageshow_callback);
    $(document).off('pageshow', '#duty_resumption_from').on('pageshow', '#duty_resumption_from', DutyResomptionForm.pageshow_callback);
    $(document).off('pageshow', '#vacation_list').on('pageshow', '#vacation_list', vacationList.pageshow_callback);
    $(document).off('pageshow', '#tawasul').on('pageshow', '#tawasul', tawasullist.pageshow_callback);
    $(document).off('pageshow', '#employee_evaluation').on('pageshow', '#employee_evaluation', appEmployeeEvaluation.pageshow_callback);
	$(document).off('pageshow', '#Salary_slip_history').on('pageshow', '#Salary_slip_history', salarySlipHistory.pageshow_callback);
	$(document).off('pageshow', '#request_sponsor_letter').on('pageshow', '#request_sponsor_letter', applyCertificate.pageshow_callback);
	$(document).off('pageshow', '#annual_performance').on('pageshow', '#annual_performance', annualPerformance.pageshow_callback);
	$(document).off('pageshow', '#attendance_summary').on('pageshow', '#attendance_summary', attendanceSummary.pageshow_callback);
	$(document).off('pageshow', '#annual_performance_filter').on('pageshow', '#annual_performance_filter', annualPerformanceFilter.pageshow_callback);
	$(document).off('pageshow', '#attendance_summary_filter').on('pageshow', '#attendance_summary_filter', attendanceSummaryFilter.pageshow_callback);
	$(document).off('pageshow', '#annual_performance_filter1').on('pageshow', '#annual_performance_filter1', annualPerformanceFilter.pageshow_callback);
	$(document).off('pageshow', '#late_permission').on('pageshow', '#late_permission', latePermission.pageshow_callback);
	
    
   // $(document).off('pagebeforecreate', '[data-role="page"]').on('pagebeforecreate', '[data-role="page"]', function () {
                   
    
    $(document).off('pagehide', '[data-role="page"]').on('pagehide', '[data-role="page"]', function () {
                   $(window).off('scroll');
                   $(document).off('scroll');
                   //$(document).off('click', '#btnBackPage');
                   if ($.mobile.activePage.attr('id') == 'dashboard') {
                   $('.area_expanded.ui-link').attr('href', '#');
                   }
                   $(document).off('focus', 'input, textarea');
                   $(document).off('blur', 'input, textarea');
                   deviceMedia.index = 0;
                   deviceMedia.fileName = [];
                   deviceMedia.saveName = [];
                   deviceMedia.mediaSrc = [];
                   });
    
	$(document).off('click', '.langButton').on('click', '.langButton', app.setLanguage);
    $(document).off('click', '.notification_main').on('click', '.notification_main', app.getNotifications);
    setTimeout(function () {
				if(helper.isLocalPc()){
					app.hide_loading();
				}
               app.checkAppVersion();
               }, 1000); //Timeout is set
},
getNotifications: function () {
    app.StartIndex = 0;
    if ($('.notification_listwrapper').css('display') == 'block') {
        app.disp_loading(1);
        dashboard.setPushNotifications();
    } else {
        $('#notify_list').html('');
    }
},
changeLanguage: function (lang) {
    localStorage.language = lang;
    app.language = lang;
    //if (!helper.isLocalPc()) {
        if (helper.isVarSet(app.staffCode) && app.staffCode != '') {
            var data = {
            StaffCode: app.staffCode,
            Language: app.getLanguage(),
            DeviceUniqueId: app.deviceUniqueId
            };
            app.generateAjax(data, 'UpdateStaffLanguage', null);
        }
    //}
},
setLanguage: function () {
    if (this.id == 'btnArabic') {
        localStorage.setItem("language", "Arabic");
        app.language = "Arabic";
    }
    else if (this.id == 'btnEnglish') {
        localStorage.setItem("language", "English");
        app.language = "English";
    }
    app.pageSelector();
},
pageSelector: function () {
    app.staffCode = localStorage.getItem('staffCode');
    if (app.staffCode != null) {
        app.pageNavigator('authentication');
    } else {
        app.pageNavigator('authentication');
    }
},
generateAjax: function (data, procedure, method) {
    //console.log("generateAjax_data-->>>>>>>>>>     "+JSON.stringify(data));
    //console.log("generateAjax_procedure-->>>>>>>>>>     "+procedure);
    //console.log("generateAjax_method-->>>>>>>>>>    "+method);
    var ukey = '-sor$3&2hjn83n9_';
    var pkey = '-e$e&ezu6qudev5uce';
    //var ukey = 'user';
    //var pkey = 'pass';
    var ekey = window.btoa(ukey + ':' + pkey);
    
    if (helper.checkNetworkConnection()) {
        var xhr;
        ajaxRequest.requestData = data;
        ajaxRequest.requestMethod = procedure;
        //ajaxRequest.authentication = 'Basic dXNlcjpwYXNz';
        ajaxRequest.authentication = 'Basic ' + ekey;
        xhr = ajaxRequest.initialize(method, procedure);
        return xhr;
    } else {
       /* var path = window.location.pathname;
        var page_name = path.split("/").pop();
        var page = page_name.split(".").slice(0, 1).pop();
        localStorage.lastPage = page;*/
        if($.mobile.activePage.attr('id') != 'nonetwork'){
			app.disp_loading();
		}
		
		if(app.nonetworkLoaded == 0){
			app.nonetworkLoaded = 1;
			app.pageNavigator('nonetwork');
		}
		
    }
    
},
selectByLanguage: function (dataEn, dataAr) {
    if (app.language == "Arabic") {
        if ((helper.isVarSet(dataAr)) && (dataAr !== "")) {
            return dataAr;
        } else {
            if ((helper.isVarSet(dataEn)) && (dataEn !== "")) {
                return dataEn;
            } else {
                return '';
            }
        }
    } else {
        if ((helper.isVarSet(dataEn)) && (dataEn !== "")) {
            return dataEn;
        } else {
            return '';
        }
    }
},
pageNavigator: function (page) {
   
	$(app.activeMobiscrollElement).each(function(k,val){
		val.hide();

	});
	app.activeMobiscrollElement = [];
	setTimeout(function(){
		//app.disp_loading(22);
	 
	},100);
    var pagePath = page + ".html";
    if ($.mobile.activePage.attr('id') === 'langhome') {
        if (app.language == "English") {
            pagePath = page + ".html";
        } else if (app.language == "Arabic") {
            pagePath = "arab/" + page + ".html";
        }
    } else {
        if (page === 'index') {
            if (app.language == "Arabic") {
                pagePath = "../" + page + ".html";
            }
        } else {
            pagePath = page + ".html";
        }
    }
    if (page === "nonetwork" && $.mobile.activePage.attr('id') === "nonetwork") {
        $.mobile.changePage(pagePath, {
                            allowSamePageTransition: false,
                            transition: 'none',
                            reloadPage: false
                            });
    } else {
		
		if($.mobile.activePage.attr('id') != page){
			$.mobile.changePage(pagePath, {
                            allowSamePageTransition: true,
                            transition: 'none',
                            reloadPage: true
                            });
		}
    }
},
pageNavigatorSelf :function(page){
	
	$(app.activeMobiscrollElement).each(function(k,val){

		val.hide()

	});
	app.activeMobiscrollElement = [];
	var pagePath = page + ".html";
    if ($.mobile.activePage.attr('id') === 'langhome') {
        if (app.language == "English") {
            pagePath = page + ".html";
        } else if (app.language == "Arabic") {
            pagePath = "arab/" + page + ".html";
        }
    } else {
        if (page === 'index') {
            if (app.language == "Arabic") {
                pagePath = "../" + page + ".html";
            }
        } else {
            pagePath = page + ".html";
        }
    }
	
	$.mobile.changePage(pagePath, {
                            allowSamePageTransition: true,
                            transition: 'none',
                            reloadPage: true
                            });

},
    /**
     *
     * @param {String} date sample input "15/12/2015" (dd/mm/yyyy)
     * @returns {String} sample output "2015-12-15" (yyyy-mm-dd)
     */
convertDateString: function (date) {
    if (!helper.isVarSet(date) || date === "") {
        return "";
    } else {
        var splitDate = date.split('/');
        var formattedDate = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
        return formattedDate; //yyyy-MM-dd
    }
},
convertDateStringMonthLast: function (date) {
    if (!helper.isVarSet(date) || date === "") {
        return "";
    } else {
        var splitDate = date.split('/');
        var formattedDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
        return formattedDate; //yyyy-dd-MM
    }
},


    /**
     *
     * @param {String} date sample input "2015-05-20" (yyyy-mm-dd)
     * @returns {String} sample output "20/05/2015" (dd/mm/yyyy)
     */
convertDateFormat: function (date) {
    if (!helper.isVarSet(date) || date === "") {
        return "";
    } else {
        var splitDate = date.split('-');
        var formattedDate = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];
        return formattedDate; //dd/mm/yyyy
    }
},
dateStringFormat: function (date, requireTime) {
    var outDate = '';
    if (!helper.isVarSet(date) || date == '') {
        outDate = '';
    } else {
        outDate = date.split(' ')[0];
        if (requireTime == 1) {
            outDate = outDate + ' ' + date.split(' ')[1] + ' ' + ((helper.isVarSet(date.split(' ')[2])) ? date.split(' ')[2] : '');
        }
    }
    return outDate;
},
parseDate: function (date, requireTime) {
    var outDate = '';
    if (!helper.isVarSet(date) || date == '') {
        outDate = '';
    } else {
        var dateInt = parseInt(date.substr(6));
        var dateVar = new Date(dateInt);
        var result = new Date(dateInt + dateVar.getTimezoneOffset() * 60000);
        outDate = result.getDate() + '/' + (result.getMonth() + 1) + '/' + result.getFullYear();
        if (requireTime == 1) {
            outDate = outDate + ('  ' + result.getHours() + ':' + result.getMinutes() + ':' + result.getSeconds())
        }
    }
    
    return outDate;
},
parseDateFormat: function (date, requireTime) {
    var outDate = '';
    var month = '';
    var day = '';
    if (date == null || date == '') {
        outDate = '';
    } else {
        var dateInt = parseInt(date.substr(6));
        var dateVar = new Date(dateInt);
        var result = new Date(dateInt + dateVar.getTimezoneOffset() * 60000);
        if (((result.getMonth() + 1) % 10) == (result.getMonth() + 1)) {
            month = '0' + (result.getMonth() + 1);
        }
        else {
            month = (result.getMonth() + 1);
        }
        
        if ((result.getDate() % 10) == result.getDate())
            day = '0' + result.getDate();
        else {
            day = result.getDate();
        }
        
        outDate = result.getFullYear() + '-' + month + '-' + day;
        
        if (requireTime == 1) {
            outDate = outDate + ('  ' + result.getHours() + ':' + result.getMinutes() + ':' + result.getSeconds());
        }
    }
    
    return outDate;
},
parseCurrentDate: function () {
    var outDate = '';
    var month = '';
    var day = '';
    var result = new Date();
    if (((result.getMonth() + 1) % 10) == (result.getMonth() + 1)) {
        month = '0' + (result.getMonth() + 1);
    }
    else {
        month = (result.getMonth() + 1);
    }
    if ((result.getDate() % 10) == result.getDate())
        day = '0' + result.getDate();
    else {
        day = result.getDate();
    }
    outDate = day + '/' + month + '/' + result.getFullYear() + ' ' + result.getHours() + ':' + result.getMinutes();
    ;
    return outDate;
},
getTimeSeconds: function (time) {
    var a = time.split(':');
    var seconds = (+a[0]) * 60 * 60 + ((helper.isVarSet(a[1])) ? ((+a[1]) * 60) : '');
    return seconds;
},
    /**
     *
     * @param {string} inputString in format "December 15, 2015","12/15/2015" or "December 15, 2015 11:10 pm"
     * @param {boolean} isDateTime - true if input is in datetime format
     * @returns {string} as 2015-12-15 or 2015-12-2015T23:10
     */
getDateString: function (inputString, isDateTime) {
    if (!helper.isVarSet(inputString) || inputString === "") {
        return '';
    } else {
        var givenDate = new Date(inputString);
        isDateTime = (helper.isVarSet(isDateTime)) ? isDateTime : false;
        if (isDateTime) {
            return givenDate.getFullYear() + '-' + addZero(parseInt(givenDate.getMonth() + 1)) + '-' + addZero(givenDate.getDate()) + 'T'
            + addZero(givenDate.getHours()) + ':' + addZero(givenDate.getMinutes());
        } else {
            return givenDate.getFullYear() + '-' + addZero(parseInt(givenDate.getMonth() + 1)) + '-' + addZero(givenDate.getDate());
        }
    }
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
},
    //For getting notification received time
getTimeDiffString: function (inputDate) {
    inputDate = new Date(inputDate);//to Local time
    var currTime = new Date();//to Local Time
    var currTimeZone = currTime.getTimezoneOffset() * 60000;
    var timeDiff = currTime.getTime() + currTimeZone - inputDate.getTime();
    var timeInMinutes = parseInt(timeDiff / 60000);
    
    if (timeInMinutes <= 1) {
        var strTime = (app.language == 'English') ? 'Just now' : 'الآن' + ' ';
    } else if (timeInMinutes < 60) {
        strTime = (app.language == 'English') ? timeInMinutes + ' minutes ago' : 'قبل ساعة';
    } else if (timeInMinutes < 1440) {
        var hours = parseInt(timeInMinutes / 60);
        if (hours <= 1) {
            strTime = (app.language == 'English') ? 'an hour ago' : 'قبل ساعة';
        } else {
            if (hours == 2) {
                strTime = (app.language == 'English') ? '2 hours ago' : 'قبل ساعتان';
            } else if (hours <= 10) {
                strTime = (app.language == 'English') ? hours + ' hours ago' : 'قبل' + ' ' + hours + ' ' + 'ساعات';
            } else {
                strTime = (app.language == 'English') ? hours + ' hours ago' : 'قبل' + ' ' + hours + ' ' + 'ساعة';
            }
        }
    } else if (timeInMinutes > 1440) {
        var days = parseInt(timeInMinutes / 1440);
        if (days <= 1) {
            strTime = (app.language == 'English') ? 'yesterday' : 'أمس';
        } else {
            if (days == 2) {
                strTime = (app.language == 'English') ? '2 days ago' : 'قبل يومين';
            } else if (days <= 10) {
                strTime = (app.language == 'English') ? days + ' days ago' : 'قبل' + ' ' + days + ' ' + 'أيام';
            } else {
                strTime = (app.language == 'English') ? days + ' days ago' : 'قبل' + ' ' + days + ' ' + 'يوم';
            }
        }
    }
    return strTime;
},
getLanguage: function () {
    var lang = 'en';
    if (app.language == "English") {
        lang = 'en';
    } else if (app.language == "Arabic") {
        lang = 'ar';
    }
    return lang;
},
getJsonDate: function (date) {
    var dt = null;
    if (date == null || date == '') {
        dt = new Date();
    } else {
        dt = new Date(date);
    }
    var newDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
    return ('/Date(' + newDate.getTime() + ')/');
},
S4: function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
},
genearetGuid: function () {
    return ((app.S4() + app.S4() + "-" + app.S4() + "-4" + app.S4().substr(0, 3) + "-" + app.S4() + "-" + app.S4() + app.S4() + app.S4()).toLowerCase());
},
displayNotification: function (page_id) {
    var device_height = 0;
    device_height = $(window).height();
    $(".notification_list").css("height", (device_height - 116) + "px");
    $(window).bind("resize", function () {
                   device_height = $(window).height();
                   $(".notification_list").css("height", (device_height - 116) + "px");
                   });
    var notification_container = $(".menuicon_right_wrapper.notification_main");
    $(page_id).bind("click", function (event) {
                    if (!notification_container.is(event.target) && notification_container.has(event.target).length === 0) {
                    $(".notification_listwrapper").hide();
                    }
                    });
    $(".menuicon_right_wrapper.notification_main").bind("click", function () {
                                                        if ($(".notification_listwrapper").is(":hidden")) {
                                                        $(".notification_listwrapper").show();
														$.mobile.loading('show');
                                                        setTimeout(function () {
                                                                   $(".notification_list_container").hide();
                                                                   $(".notification_listwrapper").show(function () {
                                                                                                       $(".notification_list_container").show();
                                                                                                       
                                                                                                      // console.log('notification_-->>', $(".notification_list_container"));
                                                                                                       var append_count = 0;
                                                                                                       $(function () {
                                                                                                         $('.notification_list').bind('scroll', function () {
                                                                                                                                      if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                                                                                                                                      var isShown = $("#notify_list div").hasClass("final");
                                                                                                                                      if (isShown) {
                                                                                                                                      $(".final").removeClass("final");
                                                                                                                                      app.StartIndex = app.StartIndex + app.Count + 5;
                                                                                                                                      dashboard.setPushNotifications();
                                                                                                                                      } else {
                                                                                                                                      }
                                                                                                                                      }
                                                                                                                                      });
                                                                                                         });
                                                                                                       });
                                                                   }, 0);
                                                        }
                                                        else {
															$('.notification_listwrapper div#loadmoreajaxloader').hide();
															$(".notification_listwrapper").hide();
															$.mobile.loading('hide');
                                                        }
                                                        });
    $(".notification_listwrapper").bind("click", function () {
                                        $(".notification_listwrapper").show();
                                        });
},
showSearchBox: function () {
    //$('[data-role="main"]').show(function () {
                                 app.swipe_panel2();
                                 $(".advsearch").unbind("click");
                                 $(".advsearch").bind("click", function () {
                                                      $(".search_wrapper.mainsearch .advsearch").hide();
                                                      $(".search_wrapper.employeeDir").fadeIn();
                                                      $(".search_wrapper.employeeDir").promise().done(function () {
                                                                                                      $(".back_to_simple_search").unbind("click");
                                                                                                      $(".back_to_simple_search").bind("click", function () {
                                                                                                                                       $(".search_wrapper.employeeDir").hide();
                                                                                                                                       $(".search_wrapper.mainsearch .advsearch").fadeIn();
                                                                                                                                       app.swipe_panel2("advsearch");
                                                                                                                                       //app.resetAdvFilters(); //Resetting advanced filter. Works in Staffrequest list page only. commented on 09 may 2016 by V!$hnu S
                                                                                                                                       });
                                                                                                      });
                                                      app.swipe_panel2("advsearch");
                                                      });
                             //    });
},
resetAdvFilters: function () {
    $('#fromDate').val('');
    $('#toDate').val('');
    $('#staffCode').val('');
    $('select#statusSelect option:first-child').attr("selected", "selected");
},
showPopup: function (message, url, style) {
    $('#txtMessage').html(message);
    $('#redirectUrl').attr("href", url);
    $(style).fadeIn('slow');
    $('[data-role="main"]').promise().done(function () {
                                           $(style).promise().done(function () {
                                                                   app.hide_loading();
                                                                   });
                                           });
    if (!helper.isLocalPc()) {
        if (device.platform.toLowerCase() === 'ios')
            navigator.splashscreen.hide();
    }
},
swipe_panel2: function (event_type) {
    var swipe_height = $(".swipe_area_wrapper2").css("height");
    swipe_height = parseInt(swipe_height);
    if (event_type == "advsearch") {
    }
    else {
        $(".swipe_area_wrapper2").css("top", "-" + (swipe_height - 50) + "px");
        $(".blur_wrapper").removeClass("blured");
    }
    function preventScroll(e) {
        e.preventDefault();
        if ($(".swipe_btn2").hasClass("down_mode")) {
            $(window).scrollTop(0);
        }
    }
    
    $(".swipe_btn2").unbind("click");
    $(".swipe_btn2").bind("click", function () {
                          
                          request.isSearch = 1;
                          if (!$(".swipe_btn2").hasClass("down_mode")) {
                          //$(document).bind("touchend.search",preventScroll);
                          $(document).bind("scrollstop.search", preventScroll);
                          app.scrollPos = $(window).scrollTop();
                          $('body').animate({
                                            scrollTop: 0
                                            }, 600);
                          
                          $('.back_to_simple_search').trigger('click');
                          $(".swipe_area_wrapper2").animate({ top: "50px" }, 280);
                          $(".blur_wrapper").addClass("blured");
                          blur_items = function () {
                          $('.blur_wrapper.blured').foggy({
                                                          blurRadius: 2,
                                                          opacity: 0.8,
                                                          cssFilterSupport: true
                                                          });
                          }
                          blur_items();
                          $(".swipe_area_wrapper2").promise().done(function () {
                                                                   $(".swipe_btn2").addClass("down_mode");
                                                                   $(".swipe_btn2").find("i").animate({ opacity: 0 }, 0);
                                                                   $(".swipe_btn2").find("i").promise().done(function () {
                                                                                                             $(this).attr("class", "fa fa-angle-double-up").animate({ opacity: 1 }, 800);
                                                                                                             });
                                                                   });
                          }
                          else {
                          //$(window).scrollTop(app.scrollPos);
                          $('body').animate({
                                            scrollTop: app.scrollPos
                                            }, 600);
                          //$(document).unbind("touchmove.search",preventScroll);
                          $(document).unbind("scrollstop.search", preventScroll);
                          $(".swipe_area_wrapper2").animate({ top: "-" + (swipe_height - 50) + "px" }, 280);
                          blur_items = function () {
                          $('.blur_wrapper.blured').foggy(false);
                          }
                          blur_items();
                          $(".swipe_area_wrapper2").promise().done(function () {
                                                                   $(".swipe_btn2").removeClass("down_mode");
                                                                   $(".blur_wrapper").removeClass("blured");
                                                                   $(".swipe_btn2").find("i").animate({ opacity: 0 }, 0);
                                                                   $(".swipe_btn2").find("i").promise().done(function () {
                                                                                                             $(this).attr("class", "fa fa-angle-double-down").animate({ opacity: 1 }, 800);
                                                                                                             });
                                                                   });
                          }
                          });
},
loadMoreShow: function (selector) {
    if (app.language === 'English') {
        $(selector).html('<center><img src="images/sialoader.gif" alt="sia loader"></center>');
    } else {
        $(selector).html('<center><img src="../images/sialoader.gif" alt="sia loader"></center>');
    }
    $(selector).show();
},
loadNoMoreShow: function (selector) {
    $(selector).html('<center><span>' + app_messages.noMoreDataToShow(app.language) + '</span></center>');
    $(selector).show();
},
loadNothingShow: function (selector) {
    $(selector).html('<center><span>' + app_messages.noDataFound(app.language) + '</span></center>');
    $(selector).show();
},
loadmoreHide: function (selector) {
    $(selector).hide();
},
getRequestTypeFromKey: function (key) {
    switch (key) {
        case 'salarycertificate':
            return appLabel.salaryCertificate(app.language);
            break;
        case 'sponsorletter':
            return appLabel.sponsorLetter(app.language);
            break;
        case 'airlinerebateletter':
            return appLabel.airlineRebateLetter(app.language);
            break;
        case 'lightdrivinglicense':
			return app_messages.Dldroptype1(app.language);
            break;
		case 'lightdriving':
            return appLabel.lightDrivingLicense(app.language);
            break;
        case 'vehicleregistration':
            //return appLabel.vehicleRegistrationLetter(app.language);
            return app_messages.vehicalRegdroptype1(app.language);
            break;
        case 'renewalofdrivinglicense':
            return appLabel.renewalOfDrivingLicense(app.language);
            break;
        case 'vehicleregistrationletter':
          //  return appLabel.vehicleRegistrationLetter(app.language);
            return app_messages.vehicalRegdroptype1(app.language);
            break;
        case 'vehicleregistrationrenewal':
            return app_messages.vehicalRegdroptype2(app.language);
            break;
        case 'saudiconsulate':
            return appLabel.saudiConsulateLetterForHaj(app.language);
            break;
        case 'saudiconsulateletterforhaj':
            return app_messages.saudiconsultdroptype1(app.language);
            break;
        case 'saudiconsulateletterforomrah':
            return app_messages.saudiconsultdroptype2(app.language);
            break;
        case 'leaverequest':
            return appLabel.leaveRequest(app.language);
            break;
        case 'latecomingapplication':
            return appLabel.lateApplication(app.language);
            break;
        case 'permissions':
            return appLabel.permission(app.language);
            break;
        case 'training':
            return appLabel.training(app.language);
            break;
        case 'profileupdationrequest':
            return appLabel.profileUpdatationRequest(app.language);
            break;
        case 'grievance':
            return app_messages.grievance(app.language);
            break;
        case 'ibtikariform':
            return appLabel.ibtikari(app.language);
            break;
        case 'dutyresumption':
            return appLabel.dutyresumption(app.language);
            break;
    }
},
getStatusValues: function () {
    var data = {
    Key: null
    };
    app.generateAjax(data, 'GetStatusList', statusAjax);
    function statusAjax(responseData) {
        if (helper.isVarSet(responseData)) {
            if (helper.isVarSet(responseData.ApiResponse))
                if (responseData.ApiResponse.StatusCode === 1 && responseData.StatusList.length > 0) {
                    staffRequests.statusObj = [];
					$.each(responseData.StatusList, function (i, data) {
                           var newObj = new Object;
                           newObj.key = data.StatusId;
                           newObj.statusEn = data.StatusEn;
                           newObj.statusAr = data.StatusAr;
                           newObj.type = data.Key;
                           staffRequests.statusObj.push(newObj);
                           });
                }
        }
    }
},
    /**
     * Function for changing select list options.
     *
     * @param {String} optionSelector
     * jquery selector of select box
     * @param {String} requestType
     * customTableKey value of request type
     * @param {String} selectedValue
     * The option that has to be kept selected in select box
     * @returns {undefined}
     */
getStatusListHtml: function (optionSelector, requestType, selectedValue) {
    var htmlOption;
    var selectedType;
    var obj = staffRequests.statusObj;
    if (staffRequests.statusObj.length === 0) {
        if (requestType === 'ibtikariform' || requestType === 'grievance') {
            htmlOption = '<option value = "0">Select Status</option>';
        } else {
            htmlOption = '<option value = "0">All</option>';
        }
        $(optionSelector).html(htmlOption);
        return;
    }
    if (!helper.isVarSet(requestType)) {
        requestType = 'request';
    }
    htmlOption = '<option value = "0">' + appLabel.requestStatus(app.language) + '</option>';
    if (requestType === 'ibtikariform') {
        selectedType = 'ibtikari';
    } else if (requestType === 'grievance') {
        selectedType = 'grievance';
    } else {
        selectedType = 'request';
    }
    $.each(obj, function (i, data) {
           if (data.type === selectedType) {
				if ($.mobile.activePage.attr('id') === 'staff_request_details') {
					if ((optionSelector === "#reqAction" && data.key !== 5) && (optionSelector === "#reqAction" && data.key !== 8)) { // The supervisor is not able to select open
						htmlOption = htmlOption + '<option value = "' + data.key + '">' + app.selectByLanguage(data.statusEn, data.statusAr) + '</option>';
					}
				} else if ($.mobile.activePage.attr('id') === 'request_for_approval') {
					if (data.key !== 4) {
						htmlOption = htmlOption + '<option value = "' + data.key + '">' + app.selectByLanguage(data.statusEn, data.statusAr) + '</option>';
					}
				} else {
					htmlOption = htmlOption + '<option value = "' + data.key + '">' + app.selectByLanguage(data.statusEn, data.statusAr) + '</option>';
				}
           } else if ($.mobile.activePage.attr('id') === 'request_for_approval' && data.key === 11) {
				htmlOption = htmlOption + '<option value = "' + data.key + '">' + app.selectByLanguage(data.statusEn, data.statusAr) + '</option>';
           }
           });
    //	}
    $(optionSelector).html(htmlOption);
    if (helper.isVarSet(selectedValue)) {
        $(optionSelector + ' option[value = ' + selectedValue + ']').attr('selected', 'selected');
    } else {
        $(optionSelector + ' option').removeAttr('selected');
    }
},
Capitalizer: function (str) {
    if (helper.isVarSet(str)) {
        return str.replace(/\w\S*/g, function (txt) {
                           return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                           });
    } else {
        return '';
    }
},
customDotDotDot: function (textSelector, widthSelector, subtractor) {
    if (!helper.isVarSet(widthSelector)) {
        widthSelector = textSelector;
    }
    setTimeout(function () {
               var width = $(widthSelector).width();
               if (helper.isVarSet(subtractor)) {
               width = width - $(subtractor).width();
               }
               if (width != 0) {
               var charCount = (width / 10);
               var text = $(textSelector).text().trim();
               $(textSelector).html(helper.trimString(text, charCount));
               }
               }, 400);
},
initDatetimePicker: function (selector, format) {
    $(selector).mobiscroll().datetime({
                                      theme: 'ios',
                                      mode: 'mixed',
                                      display: 'bottom',
                                      lang: 'en',
                                      //minDate: new Date(),
                                      //maxDate: new Date(),
                                      stepMinute: 5,
									  buttons : ['set', 'cancel','clear'],
                                      headerText: '{value}',
                                      dateFormat: format
                                      });
},
initDatePicker: function (selector, format) {
    $(selector).mobiscroll().date({
                                  theme: 'ios',
                                  mode: 'mixed',
                                  display: 'bottom',
                                  lang: 'en',
								  buttons : ['set', 'cancel','clear'],
                                  //minDate: new Date(),
                                  //maxDate: new Date(),
                                  stepMinute: 5,
									dateWheels: 'dd D MM yy',
                                  headerText: '{value}',
                                  dateFormat: format
                                  });
},
initTimePicker: function (selector, format) {
    $(selector).mobiscroll().time({
                                  theme: 'ios',
                                  mode: 'mixed',
                                  display: 'bottom',
                                  lang: 'en',
                                  //minDate: new Date(),
                                  //maxDate: new Date(),
                                  stepMinute: 5,
                                  headerText: '{value}',
                                  timeFormat: format,
                                  timeWheels: 'HHii'
                                  });
},
setDatetimeValue: function (selector, value) {
    var inst = $(selector).mobiscroll('getInst');
    inst.setVal(new Date(value));
    $(selector).val(inst._value);
},

yearfirstDate : function(date){
	var d=new Date(date.split("/").reverse().join("-"));
	var dd=d.getDate();
	var mm=d.getMonth()+1;
	var yy=d.getFullYear();
	var newdate=yy+"-"+mm+"-"+dd;
	return newdate;
}

};
var notification = {
deviceIdInterval: null,
pushNotification : null,
getDeviceID : function(){
	notification.pushNotification = PushNotification.init({
		android: {
			senderID: app.dev
		},
		ios: {
			alert: "true",
			badge: "true",
			sound: "true"
		}
	});
	if(notification.pushNotification != null){
		if(hasActualValue(notification.pushNotification)){
			notification.pushNotification.setApplicationIconBadgeNumber(function() {
					console.log('success');
				}, function() {
					console.log('error');
				}, 0);
		}
	}
		
	notification.pushNotification.on('registration', function(data) {
			// data.registrationId
		window.localStorage.setItem("regId", data.registrationId);
		clearInterval(notification.deviceIdInterval);
		var data = {
			StaffCode: app.staffCode,
			DeviceUniqueId: app.deviceUniqueId,
			UniversallyUniqueId: helper.isVarSet(localStorage.getItem('regId')) ? localStorage.getItem('regId') : null
		};
		app.generateAjax(data, 'UpdateUniversallyUniqueId', successAjax);
		
		function successAjax(data) {
			if(data.ApiResponse.Message != undefined && data.ApiResponse.Message == 'Failure'){
				arrMsg = data.ApiResponse.Details.split(';');
				if(arrMsg[0] != undefined && arrMsg[0].trim() == "OAuth Failure -DateTime Mismatch. App TimeZone:- -330"){
						app.hide_loading()
				}
			}	
			
		}
	});
	
	notification.pushNotification.on('notification', function(data) {
		e = data;
		console.log(data);
		if(data.additionalData.foreground){
			var count = parseInt($('.notification_count').text());
			if (data.count > count) {
			   
				count = data.count;
				app.notificationCount = count;
				$('.notification_count').text(count);
			}
			if (data.additionalData.staffid == app.staffCode && helper.isVarSet(app.pin)) {
				navigator.notification.beep(1);
				if ($('#popupBox').length <= 0) {
					
					var html = '<div class="notification_wrapper_bg" id="popupBox">' +
					'<div class="notification_wrapper">' +
					'<div class="notification_list_wrapper">' +
					'<div class="gcm_notification_list">' +
					'<a href="javascript: app.disp_loading();notification.onView(' + data.additionalData.notificationid + ');" class="notification_view">' + appLabel.view(app.language) + '</a>' +
					'<div class="notification_block">' + e.message + '</div>' +
					'</div>' +
					'</div>' +
					'<div class="popupbtn_notification">' +
					'<button data-role="none" onclick="javascript: $(\'#popupBox\').hide();$(\'div\').remove(\'#popupBox\');">' + appLabel.close(app.language) + '</button>' +
					'</div>' +
					'</div>' +
					'</div>';
					
					$(html).appendTo('[data-role="page"].ui-page-active');
					$('#popupBox').fadeIn('slow');
				} else {
					var notif = '<div class="gcm_notification_list" style="display:none;">' +
					'<a href="javascript: app.disp_loading();notification.onView(' + data.additionalData.notificationid + ',0);" class="notification_view">' + appLabel.view(app.language) + '</a>' +
					'<div class="notification_block">' + e.message + '</div>' +
					'</div>';
					$(notif).appendTo('.notification_list_wrapper');
					$('.gcm_notification_list').fadeIn();
				}
			}
			var data11 = {
				StaffCode: app.staffCode
			};
			app.generateAjax(data11, 'GetDashboardDetails', notification.successNotificationAjax2);
		
		}else{
		
		
			app.pushNotificationDates = data.message; 
			
			localStorage.notificationid = data.additionalData.notificationid;
			if (helper.isVarSet(localStorage.staffCode) && data.additionalData.staffid == localStorage.staffCode) {
				if(helper.isVarSet(localStorage.staffCode)){
					if(hasActualValue(notification.pushNotification)){
						notification.pushNotification.setApplicationIconBadgeNumber(function() {
							console.log('success');
						}, function() {
							console.log('error');
						}, app.notificationCount);
					}
				}
				var count = parseInt($('.notification_count').text());
				if (data.count > count) {
					count = data.count;
					$('.notification_count').text(count);
				}
				
				
				var data1 = {
					NotificationId: localStorage.notificationid,
					StaffId: app.staffCode
				};
				
				currentPageId = $.mobile.activePage.attr('id');
				pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
				
				if($.inArray(currentPageId, pagesBeforeLogin) < 0){
					 var data11 = {
						StaffCode: app.staffCode
					};
					app.generateAjax(data11, 'GetDashboardDetails', notification.successNotificationAjax2);
				}
			}
			if (helper.isVarSet(localStorage.notificationid)) {
			
				
				
				
				if (helper.isVarSet(localStorage.staffCode) && data.additionalData.staffid == localStorage.staffCode) {
					app.disp_loading();
					var data = {
						NotificationId: localStorage.notificationid,
						StaffId: app.staffCode
					};
				
					app.generateAjax(data, 'GetNotificationById', notification.successNotificationAjax);
					
					
					var dataRead = {
						"NotificationId": localStorage.notificationid,
						"IsRead": 1,
						"StaffId": app.staffCode,
						"DeviceUniqueId": app.deviceUniqueId
					};
					app.generateAjax(dataRead, 'UpdateNotificationReadStatus', dashboard.updateCountHtml);
					localStorage.removeItem('notificationid');
				}
				
				
			}
			
			
		
		}
	
	});


},

/*
getDeviceID: function () {
    var pushNotification = window.plugins.pushNotification;
    if (device.platform === 'android' || device.platform === 'Android') {
        pushNotification.register(notification.successHandler, notification.errorHandler, { "senderID": app.neo, "ecb": "notification.onNotificationGCM" });
    } else {
        pushNotification.register(notification.tokenHandler, notification.errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "notification.onNotificationAPN" });
    }
},
tokenHandler: function (msg) {
    clearInterval(notification.deviceIdInterval);
    window.localStorage.setItem("regId", msg);
    if (helper.isVarSet(app.staffCode) && app.staffCode != "") {
        var data = {
        StaffCode: app.staffCode,
        DeviceUniqueId: app.deviceUniqueId,
        UniversallyUniqueId: helper.isVarSet(localStorage.getItem('regId')) ? localStorage.getItem('regId') : null
        };
        app.generateAjax(data, 'UpdateUniversallyUniqueId', successAjax);
        
        function successAjax() {
            //console.log('Device Registration Update Success');
            ;
        }
    }
},
successHandler: function () {
    ;
},*/
onView: function (id,flag) {// invoking from dashboard also
    var data = {
    NotificationId: id,
    StaffId: app.staffCode
    };
	
    app.disp_loading();
	$('#popupBox').hide();
	pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
	if($.inArray($.mobile.activePage.attr('id'), pagesBeforeLogin) < 0){
		app.generateAjax(data, 'GetNotificationById', notification.successNotificationAjax1);
	}else{
		app.generateAjax(data, 'GetNotificationById', notification.successNotificationAjax);
	
	}
},
successNotificationAjax2 :function(responseData){
	if(responseData.CommonDetails != undefined && responseData.CommonDetails != null){
		var memoCount = responseData.CommonDetails.MemoCircularCount;
		var surveyCount = responseData.CommonDetails.SurveyCount;
		var announcementCount = responseData.CommonDetails.AnnouncementCount;
		var trainingCount = responseData.CommonDetails.TrainingCount;
		var civilCount = responseData.CommonDetails.CivilserviceCount;
		var tawasulCount = responseData.CommonDetails.TawsulCount;
		
		if(trainingCount > 0){
			$('.trainingCount span').html(trainingCount);
			$('.trainingCount').show();
		}else{
			$('.trainingCount').hide();
		}
		if(surveyCount > 0){
			$('.surveyCount').html(surveyCount);
			$('.surveyCount').show();
		}else{
			$('.surveyCount').hide();
		}
		if(announcementCount > 0){
			$('.announcementCount').html(announcementCount);
			$('.announcementCount').show();
		}else{
			$('.announcementCount').hide();
		}
		if(civilCount > 0){
			$('.civilCount span').html(civilCount);
			$('.civilCount').show();
		}else{
			$('.civilCount').hide();
		}
		if(tawasulCount > 0){
			$('.tawasulCount span').html(tawasulCount);
			$('.tawasulCount').show();
		}else{
			$('.tawasulCount').hide();
		}
		if(memoCount > 0){
			$('.memoCircularCount span').html(memoCount);
			$('.memoCircularCount').show();
		}else{
			$('.memoCircularCount').hide();
		}
	}

},
successNotificationAjax: function (response) {
    var approverId = response.Notifications.ApproverId;
    var customManagementTableKey = response.Notifications.CustomManagementTableKey;
    var notificationId = response.Notifications.NotificationId;
    var notificationType = response.Notifications.NotificationTypeName;
    var requestId = response.Notifications.RequestId;
    var approvalId = response.Notifications.RequestApprovalId;
	PermissionDetails = '';
	if(response.Notifications.PermissionDetails != undefined && response.Notifications.PermissionDetails != '' && response.Notifications.PermissionDetails != null){
		PermissionDetails = response.Notifications.PermissionDetails.trim();
	}
    var err = 0;
    if (!helper.isVarSet(requestId)) {
        err = 1;
    }
    if (!helper.isVarSet(notificationType)) {
        err = 1;
    }
	else{
	
		if(notificationType == 'anniversary' || notificationType == 'birthday'){
			localStorage.onViewClicked = 1;
		}
	}
    if (!helper.isVarSet(notificationId)) {
        err = 1;
    }
    if (!helper.isVarSet(customManagementTableKey)) {
        err = 1;
    }
    if (!helper.isVarSet(approverId)) {
        err = 1;
    }
    if (err === 0) {
		pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
		if($.inArray($.mobile.activePage.attr('id'), pagesBeforeLogin) < 0){
			dashboard.processNotification(requestId, notificationType, notificationId, customManagementTableKey, approverId, approvalId,PermissionDetails);
		}else{
			dashboard.NotificationClickedData = response;
			pagesBeforeLogin = ['langhome','authentication','forgot_password','login','pin_setup','verify_otp'];
			
		   setTimeout(function(){ 
				if($.inArray($.mobile.activePage.attr('id'), pagesBeforeLogin) >= 0){
					app.hide_loading(); 
				}
			}, 4000);
			
		}
	} else {
        app.hide_loading();
        if (!$(".notification_listwrapper").is(":visible")) {
            $(".menuicon_right_wrapper.notification_main.right-fit-mainlink").trigger('click');
        }
    }
},
successNotificationAjax1: function (response) {
    var approverId = response.Notifications.ApproverId;
    var customManagementTableKey = response.Notifications.CustomManagementTableKey;
    var notificationId = response.Notifications.NotificationId;
    var notificationType = response.Notifications.NotificationTypeName;
    var requestId = response.Notifications.RequestId;
    var approvalId = response.Notifications.RequestApprovalId;
	PermissionDetails = '';
	if(response.Notifications.PermissionDetails != undefined && response.Notifications.PermissionDetails != '' && response.Notifications.PermissionDetails != null){
		PermissionDetails = response.Notifications.PermissionDetails.trim();
	}
	
    var err = 0;
    if (!helper.isVarSet(requestId)) {
        err = 1;
    }
    if (!helper.isVarSet(notificationType)) {
        err = 1;
    }else{
	
		if(notificationType == 'anniversary' || notificationType == 'birthday'){
			localStorage.onViewClicked = 1;
		}
	}
    if (!helper.isVarSet(notificationId)) {
        err = 1;
    }
    if (!helper.isVarSet(customManagementTableKey)) {
        err = 1;
    }
    if (!helper.isVarSet(approverId)) {
        err = 1;
    }
    if (err === 0) {
        dashboard.processNotification(requestId, notificationType, notificationId, customManagementTableKey, approverId, approvalId,PermissionDetails);
	} else {
        app.hide_loading();
        if (!$(".notification_listwrapper").is(":visible")) {
            $(".menuicon_right_wrapper.notification_main.right-fit-mainlink").trigger('click');
        }
    }
}
};
/*For Annual performance***/
function openTab(evt, sectName) {
	$('.tab-container li.tablinks').removeClass('active');
	$('.tab-container li.tablinks a').removeClass('defaultTabFilter');
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(sectName).style.display = "block";
    evt.currentTarget.className += " active";
}
function openTabFilter(elm, sectName) {
	$('.tab-container li.tablinks').removeClass('active');
	$('.tab-container li.tablinks a').removeClass('defaultTabFilter');
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(sectName).style.display = "block";
    $(elm).addClass("active");
}