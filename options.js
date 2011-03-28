$(document).ready(function(){ 
    if ( localStorage["hideStatus"] === undefined ) {
        localStorage["hideStatus"] = 'show';
    }

    var hideStatus = localStorage["hideStatus"];

    if ( hideStatus == 'hide' ) {
        $('input[name=hideStatusOption]').attr('checked', true);
    }

    else {
        $('input[name=hideStatusOption]').removeAttr('checked');
    }

    $('#saveOptions').click(function() {
        if ($('#hideStatusOption').attr('checked')) {
            localStorage["hideStatus"] = 'hide';
            alert('Status badges will be hidden.');
        }

        else {
            localStorage["hideStatus"] = 'show';
            alert('Status badges will be displayed.');
        }
    });
});
