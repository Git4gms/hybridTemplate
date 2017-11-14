var appHelper = {
    showPageLoading  : function(){
        $('.page-overlay-loading').show();
    },
    hidePageLoading  : function(){
        $('.page-overlay-loading').hide();
    },
    navigateToPage : function(pageName){
        $.mobile.changePage(pageName+".html", {
        });
    },
    checkNetworkConnection: function (t) {
        if (appHelper.isLocalPc()) {
            return true;
        }
        if (navigator.network.connection.type === Connection.NONE) {//If not connected to a network
            return false;
        } else {
            return true;
        }
    },
    sendRequest : function(url, type, data, dataType, callBackFn) {
		timest = Number(new Date());
		if (dataType == "JSON" || dataType == "json") {
			//data = JSON.stringify(data);
		}
		var request = $.ajax({
			url: url,
			type: type,
			data: data,
			crossDomain: true,
			contentType: "application/x-www-form-urlencoded",
			dataType: dataType
		
		});
		request.done(function (msg) {
			callBackFn(msg);
		});
		request.fail(function (jqXHR, textStatus) {
			var msg = "Request failed: " + textStatus;
			if(textStatus == "abort"){
				msg = "abort";
			}
			callBackFn(msg);
		});
		return request;
    },
    showToast: function (message) {
        if (!appHelper.isLocalPc) {
            window.plugins.toast.showLongBottom(message)
        }else{
            alert(message);
        }
    },
    isLocalPc: function () {
        if (window.location.href.indexOf('localhost') > -1) {
            return true;
        } else {
            return false;
        }
    },
    isNumber: function (number) {
        var regex = /^[0-9]+$/;
        return regex.test(number);
    },
    
    isEmail: function (mail) {
        var regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(mail);
    },
}
function stripHTMLTags(value) {
    text = value.replace(/<(?:.|\n)*?>/gm, '');
    return text;
}
function getFileNameFromPath(path) {
    var filename = path.replace(/^.*[\\\/]/, '');
    return filename;
}

function getFileNameFromPath(path) {
	filename = '';
	if(path != 'undefined' && path != '' && path != null ){
		 filename = path.replace(/^.*[\\\/]/, '');
	}
    return filename;
}
function getFileTypeFromFileName(fileName) {
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1); 
	return ext;
}