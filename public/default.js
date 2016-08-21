window.onload = function () {
    var videoData = {

    }

    initVideo(videoData);
};

function initVideo(videoData) {
    var timestampArray = videoData.timestamps.map(function(timestamp) {return timestamp.time});

    var myPlayer = amp('tutorialPlayer', { /* Options */
        techOrder: ["azureHtml5JS", "html5", "flashSS", "silverlightSS"],
        "nativeControlsForTouch": false,
        autoplay: true,
        controls: true,
        "logo": { "enabled": false },
        poster: videoData.posterURL,
        width: videoData.size[0],
        height: videoData.size[1],
        plugins: {
            timelineMarker: {
                markertime: timestampArray,
                timeformat: 'seconds'
            }
        }
    }, function() {
          console.log('Ready to play');
          initTimestampEvents(this, timestampArray);

          this.addEventListener('timestampchanged', function(e) {
            console.log(videoData.timestamps[e.updatedTimestampIndex].title);
            renderTimestamp('tutorialPane', videoData.timestamps[e.updatedTimestampIndex]);
          });

          this.addEventListener('ended', function() {
            console.log('Finished!');
        });
      });
    
    myPlayer.src([{ 
        src: videoData.url, 
        type: "application/vnd.ms-sstr+xml"
    }]);
}

function initTimestampEvents(player, timestamps) {
    var currentTimestampIndex = -1;

    var timestampchangedevent = new Event('timestampchanged');

    player.addEventListener('timeupdate', function(e) {            
        var cachedTimestampIndex = currentTimestampIndex;

        for (var i =0; i< timestamps.length; i++) {
            if (this.currentTime() > timestamps[i])
                currentTimestampIndex = i;
            else  
                break;
        }

        if (currentTimestampIndex !== cachedTimestampIndex) {
            console.log("Timestamp changed: " + currentTimestampIndex);
            
            timestampchangedevent.updatedTimestampIndex = currentTimestampIndex;
            player.el_.dispatchEvent(timestampchangedevent);
        }
    });

}

function renderTimestamp(elementId, timestamp) {
    var hostElement = document.querySelector('#'+elementId);
    hostElement.innerHTML="";

    var timestampHTML = document.createElement('div');
    timestampHTML.classList.add("tutorialContent");

    // Header title
    var headerHTML = document.createElement("h2");
    headerHTML.innerText = timestamp.title;
    headerHTML.classList.add("dockedSection");
    hostElement.appendChild(headerHTML);

    var descriptionHTML = renderDescription(timestamp.description);
    if (descriptionHTML) timestampHTML.appendChild(descriptionHTML);

    var listHTML = renderList(timestamp.list);
    if (listHTML) timestampHTML.appendChild(listHTML);

    var orderedListHTML = renderOrderedList(timestamp.orderedList);
    if (orderedListHTML) timestampHTML.appendChild(orderedListHTML);

    hostElement.appendChild(timestampHTML);

    var linkHTML = renderLink(timestamp.link);
    if (linkHTML) hostElement.appendChild(linkHTML);
    
}

function renderDescription(description) {
    if (description) {
        var descriptionHTML = document.createElement("div");
        descriptionHTML.innerText = description;
        descriptionHTML.classList.add("tutorialSection");
        return descriptionHTML;
    } else { return null;}
}

function renderList (list) {
    if (list && list.values && list.values.length > 0 ) {
        var listSectionHTML = document.createElement("div");
        var listHeaderHTML = document.createElement("h3");
        listHeaderHTML.innerText = list.title;
        listSectionHTML.appendChild(listHeaderHTML);

        var listHTML = document.createElement("ul");
        for (var i = 0; i < list.values.length; i++) {
            var listItemHTML = document.createElement("li");
            listItemHTML.innerText = list.values[i];
            listHTML.appendChild(listItemHTML);
        }   

       listSectionHTML.appendChild(listHTML); 
       listSectionHTML.classList.add("tutorialSection");   
      return listSectionHTML;
    } else {return null;}
}

function renderOrderedList (list) {
    if (list && list.values && list.values.length > 0 ) {
        var listSectionHTML = document.createElement("div");
        var listHeaderHTML = document.createElement("h3");
        listHeaderHTML.innerText = list.title;
        listSectionHTML.appendChild(listHeaderHTML);

        var listHTML = document.createElement("ol");
        for (var i = 0; i < list.values.length; i++) {
            var listItemHTML = document.createElement("li");
            listItemHTML.innerText = list.values[i];
            listHTML.appendChild(listItemHTML);
        }   

       listSectionHTML.appendChild(listHTML); 
       listSectionHTML.classList.add("tutorialSection");   
       return listSectionHTML;
    } else {return null;}
}

function renderLink(link) {
    if (link) {
        var linkHTML = document.createElement("a");
        linkHTML.innerText = link.label;
        linkHTML.setAttribute("href", link.url);
        linkHTML.setAttribute("target", "_blank");
        linkHTML.classList.add("dockedSection");
        return linkHTML;
    } else { return null;}
}
