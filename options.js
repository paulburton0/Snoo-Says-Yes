$(document).ready(function(){ 
    if ( localStorage["hideStatus"] === undefined ) {
        localStorage["hideStatus"] = 'show';
    }

    if ( localStorage["hideStatus"] == 'hide' ) {
        $('#hideStatus').attr('checked', "checked");
    }

    else {
        $('#hideStatus').removeAttr('checked');
    }

    $('#hideStatus').click(function(){
        if ($('#hideStatus').attr('checked')) {
            localStorage["hideStatus"] = 'hide';
            $('#save').fadeIn(1200, function(){$('#save').fadeOut(2000);});
        }
        else{
            localStorage["hideStatus"] = 'show';
            $('#save').fadeIn(1200, function(){$('#save').fadeOut(2000);});
        }
    });
});
