var url = chrome.extension.getBackgroundPage().selectedURL;
var tabId = chrome.extension.getBackgroundPage().selectedTabId;
var title = chrome.extension.getBackgroundPage().selectedTitle;
var index = chrome.extension.getBackgroundPage().selectedIndex;

url = encodeURIComponent(url);
var submitUrl = 'http://www.reddit.com/submit?url=' + url;
var resubmitUrl = 'http://www.reddit.com/submit?resubmit=true&url=' + url;
var submitCount = 0;
var info;
var permalinks = [];
var dateNow = new Date().getTime(); 
var entryDate; 
var oneDay = 86400000; // milliseconds
var newIndex = index + 1;

$(document).ready(function(){
    // Close the popup when the close button is clicked
    $('#close').click(function(){
        closePopup();
    });

    if(localStorage["openDiscussion"] == 'selectedTab'){
        $('.submission_link').live('click', function(e){
            var href = e.currentTarget.href;
            chrome.tabs.update(tabId, {url: href});
            closePopup();
        });
    }

    if(localStorage["openDiscussion"] == 'newTab'){
        $('.submission_link').live('click', function(e){
            var href = e.currentTarget.href;
            chrome.tabs.create({url: href, index: newIndex});
            closePopup();
        });
    }

    if(localStorage["openSubmission"] == 'submitSelectedTab'){
        $('#submit_link').live('click', function(e){
            var href = e.currentTarget.href;
            chrome.tabs.update(tabId, {url: href});
            closePopup();
        });
    }

    if(localStorage["openSubmission"] == 'submitNewTab'){
        $('#submit_link').live('click', function(e){
            var href = e.currentTarget.href;
            chrome.tabs.create({url: href, index: newIndex});
            closePopup();
        });
    }
});

// get URL info
function getURLInfo(url){
    var redditUrl = 'http://www.reddit.com/api/info.json?url=' + url;
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
            submitCount + ' ' + submissionLabel + ' | </span> <a id="submit_link" title="Submit to reddit"' +
            ' href="' + resubmitUrl + 
            '">resubmit</a></div>');
        
        showLinks();
    }
    else{
        if(localStorage["hideStatus"] == 'hide'){
            $('#data').append('<h4>' + title + '</h4>');
            $('#data').append('<div id="submission_status"><a id="submit_link" title="Submit to reddit"' +
                ' href="' + submitUrl + '">submit</a></div>');
        }
        else{
            if(localStorage["openSubmission"] == 'submitSelectedTab'){
                chrome.tabs.update(tabId, {url: submitUrl});
                closePopup();
            }

            if(localStorage["openSubmission"] == 'submitNewTab'){
                chrome.tabs.create({url: submitUrl, index: newIndex});
                closePopup();
            } 
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
                    '<div class="linktext"><a class="submission_link" href="http://www.reddit.com' +
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
    
    if(ageDays <= 1){
        submitted = 'today';
    }
    else if(ageDays == 2){
        submitted = 'yesterday';
    }
    else{
        submitted = ageDays + ' days ago';
    }

    return submitted;
}


