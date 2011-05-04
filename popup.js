var url = chrome.extension.getBackgroundPage().selectedURL;
var title = chrome.extension.getBackgroundPage().selectedTitle;

url = encodeURIComponent(url);
var submitUrl = 'http://www.reddit.com/submit?url=' + url;
var resubmitUrl = 'http://www.reddit.com/submit?resubmit=true&url=' + url;
var submitCount = 0;
var info;
var permalinks = [];
var dateNow = new Date().getTime(); 
var entryDate; 
var oneDay = 86400000; // milliseconds

$(document).ready(function(){
    // Close the popup when the close button is clicked
    $('#close').click(function(){
        closePopup();
    });
});

// get URL info
function getURLInfo(url){
    var redditUrl = 'http://www.reddit.com/api/info.json?url=' +url;
    $.getJSON(
        redditUrl,
        parseURLData
    );
}

// parse json data
function parseURLData(jsonData){
    submitCount=0;
    $('div#timeout').hide(0);
    var data = [ 0, "", "", "", "", "", "", "", "", url];

    for(var i=0; entry = jsonData.data.children[i]; i++){
            submitCount +=1;
            entryDate = new Date(entry.data.created_utc*1000).getTime();
            permalinks[i] = {
                link: entry.data.permalink,
                title: entry.data.title,
                score: entry.data.score + '',
                age: parseAge(entryDate),
                comments: entry.data.num_comments + '',
                subreddit: entry.data.subreddit,
            };
    }
    
    if(submitCount){
        var submissionLabel;

        if(submitCount == 1){
            submissionLabel = 'time';
        }
        else{
            submissionLabel = 'times';
        }

        $('#data').append('<h4>' + title + '</h4>');
        $('#data').append('<div id="submission_status"><span id="submitnumber">submitted ' +
            submitCount + ' ' + submissionLabel + ' | </span> <a target="_blank" title="Submit to reddit"' +
            ' href="' + resubmitUrl + 
            '">resubmit</a></div>');
        
        showLinks();
    }
    else{
        if(localStorage["hideStatus"] == 'hide'){
            $('#data').append('<h4>' + title + '</h4>');
            $('#data').append('<div id="submission_status"><a target="_blank" title="Submit to reddit"' +
                ' href="' + submitUrl + '">submit</a></div>');
        }
        else{
            chrome.tabs.create({
                url: submitUrl
            });

            window.close();
        }
    }
}

function showLinks(){
    if(submitCount)
    $.each(
        permalinks,
        function(index, permalink){
            $('#links').append(
                '<li>' + 
                '<div class="linkblock"><div class="score">' +permalink.score+'</div>' +
                    '<div class="linktext"><a target="_blank" href="http://www.reddit.com' +
                permalink.link + '" title="' +
                permalink.link + '">' +
                permalink.title + '</a>' +
                '<div class="age">submitted ' + permalink.age + ' &bull; ' +
                permalink.comments + ' comments &bull; r/' + permalink.subreddit +
                '</div></div></div>' +
                '</li>'
            );
        }
    );
}

function closePopup(){
    // remove popup by selecting the tab
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.update(tab.id, {selected: true});
    });
}

function parseAge(entryDateMs){
    var submitted;
    var ageDays = Math.ceil((dateNow - entryDateMs) / oneDay);
    
    if (ageDays <= 1){
        submitted = 'today';
    }
    else {
        submitted = ageDays + ' days ago';
    }

    return submitted;
}
