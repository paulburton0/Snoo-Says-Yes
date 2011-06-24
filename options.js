$(document).ready(function(){ 
    if(localStorage["hideStatus"] === undefined){
        localStorage["hideStatus"] = 'show';
    }

    if(localStorage["hideStatus"] == 'hide'){
        $('#hideStatus').attr('checked', 'checked');
    }
    else{
        $('#hideStatus').removeAttr('checked');
    }

    $('#hideStatus').click(function(){
        if ($('#hideStatus').attr('checked')){
            localStorage["hideStatus"] = 'hide';
        }
        else{
            localStorage["hideStatus"] = 'show';
        }
    });

    if(localStorage["openDiscussion"] == 'newTab'){
        $('#openInNewTab').attr('checked', 'checked');
    }
    else{
        localStorage["openDiscussion"] = 'selectedTab';
        $('#openInSelectedTab').attr('checked', 'checked');
    }

    $('#openInNewTab').click(function(){
        localStorage["openDiscussion"] = 'newTab';
    });

    $('#openInSelectedTab').click(function(){
        localStorage["openDiscussion"] = 'selectedTab';
    });

    if(localStorage["openSubmission"] == 'submitNewTab'){
        $('#submitInNewTab').attr('checked', 'checked');
    }
    else{
        localStorage["openSubmission"] = 'submitSelectedTab';
        $('#submitInSelectedTab').attr('checked', 'checked');
    }

    $('#submitInNewTab').click(function(){
        localStorage["openSubmission"] = 'submitNewTab';
    });

    $('#submitInSelectedTab').click(function(){
        localStorage["openSubmission"] = 'submitSelectedTab';
    });

    $('.option').click(function(){
        $('#save').fadeIn(1000, function(){$('#save').fadeOut(1000);});
    });
});

