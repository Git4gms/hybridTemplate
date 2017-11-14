var appLogin = {

    onPageShow : function(){

        $( document ).off('click','.signUpLink').on( 'click','.signUpLink', appLogin.gotoSignupPage);

        appHelper.hidePageLoading();
    },
    gotoSignupPage : function(){
        appHelper.showPageLoading();
        appHelper.navigateToPage('signup');  
    }

};