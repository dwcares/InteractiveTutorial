window.onload = function () {
    var videoData = {
        size: [584, 330],
        posterURL: "https://i.ytimg.com/vi_webp/Q4PwexJxiDM/sddefault.webp",
        link: {label: "Classic Cocktail Kit", url: "https://makerskit.com/products/cocktails"},
        url: "https://testmakerskit.blob.core.windows.net/asset-a8ceb4c2-580f-4d27-8c2a-352bd1804ea5/makerskit-cocktail.mp4?sv=2012-02-12&sr=c&si=41a97b1d-5a63-41b9-ba60-035bc977a645&sig=1s6pHmQbAaA0GH0%2Bj%2BICgY1ScGIo%2BGZzOpNNM83PJs0%3D&st=2016-08-18T01%3A45%3A41Z&se=2116-08-18T01%3A45%3A41Z",
        timestamps: [
            {time: 0, title: "DIY Classic Cocktails", description: "Relaxing with a hard-to-find craft IPA or a glass of your favorite vintage is a great way to spend an evening, but there is something truly special about mixing a fabulous cocktail. Our cocktail bartending kit for adults makes mixing up your own favorite libations a breeze!",link: {label: "MakersKit: Classic Cocktail Kit", url: "https://makerskit.com/products/cocktails"}},
            {time: 23, title: "What you need", 
                list: {title: "Tools", values:["Quart Sized Mason Jar Shaker", "Hardwood Muddler",  "Cocktail Stirrer Spoon", "Ice Tongs", "Stainless Steel Strainer", "Stainless Steel Jigger (1oz/1.5oz)", "2 Liquor Pour Spouts"]}},
            {time: 51, title: "Mojito", description: "A Mojito is a traditional Cuban highball. It has also often been said that Ernest Hemingway made the bar called La Bodeguita del Medio famous when he became one of its regulars and wrote 'My mojito in La Bodeguita, My daiquiri in El Floridita' on a wall of the bar. ",
                list: {title: "Ingredients", values:["10 Mint Leaves",  "1/2 Lime", "Club Soda", "White Rum", "Sugar", "Ice"]},
                orderedList: {title: "Steps", values:["In your glass, muddle mint leaves and sugar.","Fill the glass with ice, then add rum and lime juice.","Stir, then add club soda and club soda to taste."]}},
            {time: 3*60+14, title: "Whiskey Sour", description: "The oldest historical mention of a whiskey sour was published in the Wisconsin newspaper, Waukesha Plain Dealer, in 1870",
                list: {title: "Ingredients", values:["Bourbon whiskey",  "Fresh lemon juice", "Simple syrup", "Maraschino cherries ", "Lemon peel", "Ice"]},
                orderedList: {title: "Steps", values:["Combine all ingredients in a cocktail shaker. If you don't have a cocktail shaker, use two tall glasses or screw-top glass jar will also do the trick.","Shake the drink for about 10 seconds to mix everything","Strain the ingredients into a glass. Garnish with maraschino cherries or a a lemon twist."]}},
            {time: 5*60+38, title: "More Cocktail Ideas", link: {label: "MakersKit: Mason Jar Herb Garden", url: "https://makerskit.com/products/herbgardenset"}, orderedList: {title: "Tips", values:["Personalized shot glasses!", "Grow your own mint!"]}},
            
             {time: 6*60+25, title: "DIY Classic Cocktails", description: "Relaxing with a hard-to-find craft IPA or a glass of your favorite vintage is a great way to spend an evening, but there is something truly special about mixing a fabulous cocktail. Our cocktail bartending kit for adults makes mixing up your own favorite libations a breeze!",link: {label: "Classic Cocktail Kit", url: "https://makerskit.com/products/cocktails"}}
        ]
    }

    initVideo(videoData);
};

function initVideo(videoData) {
    var timestampArray = videoData.timestamps.map(function(timestamp) {return timestamp.time});
          initChat();

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
          var tutorialPane = document.querySelector('#tutorialPane');

          initTimestampEvents(this, timestampArray);

          this.addEventListener('timestampchanged', function(e) {
            console.log(videoData.timestamps[e.updatedTimestampIndex].title);
            renderTimestamp(tutorialPane, videoData.timestamps[e.updatedTimestampIndex]);
          });

          this.addEventListener('ended', function() {
            console.log('Finished!');

            setTimeout(function() {
                this.currentTime(0);
                this.play();
            }, 5000);
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

/************* CHAT ******************/

function initChat() {
    // setup my socket client
    var socket = io();

    var chat = document.querySelector(".chat");
    var chatHeader = document.querySelector(".chatHeader");
    var userCountElement = document.querySelector(".chatHeader .userCount");
    var chatBody = chat.querySelector(".chatBody");
    var chatInput = document.querySelector(".chatInput input");
    var typing = false;
    var lastIncomingUser = "";
    var lastTypingTimer;
    var TYPING_TIMER_LENGTH = 4000;
    var username = Date.now();  

    chatHeader.onclick = function(e) {
        if (chat.classList.contains("collapsed")) {
            chat.classList.remove("collapsed");
        } else {
            chat.classList.add("collapsed");
        }
    };

    chatInput.oninput = function(e) {
        
        if (!typing) {
            typing = true;
            socket.emit("typing", {username: username});
        } 

        clearTimeout(lastTypingTimer);
        lastTypingTimer = setTimeout(function () {
            socket.emit('stop typing', {username: username});
            typing = false;
        }, TYPING_TIMER_LENGTH);
    }

    chatInput.onkeydown = function(e) {
         if (event.which === 13) {
            if (username) {
                sendMessage();
                socket.emit('stop typing', {username: username, commit:true});
                typing = false;
            }
        } else if (event.which === 8 && (chatInput.value.length <= 1 || (chatInput.selectionEnd - chatInput.selectionStart >= chatInput.value.length))) {
            if (username) {
                socket.emit('stop typing', {username: username});
                typing = false;
                chatInput.value = "";
                e.preventDefault();
            }
        }
    }

      function sendMessage () {
            var message = chatInput.value;
            if (message) {
                addChatMessage({
                    username: username,
                    message: message
                }, true);
                
                chatInput.value = "";
                socket.emit('new message', {username: username, message: message});
            }
        }

    function addChatMessage(message, isMe, typingMessage) {
        var chatElement = document.createElement("div");
        chatElement.classList.add("chatBubble");

        if (!isMe && lastIncomingUser !== message.username) {
            var chatLabel = document.createElement("div");
            chatLabel.innerText = message.username;
            chatLabel.classList.add("chatBubbleLabel");
            chatElement.appendChild(chatLabel);

            if (!typingMessage)
                lastIncomingUser = message.username; // Don't show user name label if its the same user
        }

        var chatText = document.createElement("div");
        chatText.innerText = message.message;
        chatText.classList.add("chatBubbleContent");
        chatElement.appendChild(chatText);

        if (typingMessage) {
            chatElement.classList.add("typingMessage");
        } 

        if (isMe) { 
            chatElement.classList.add("mine"); 
        } else {
            chatElement.classList.add("user-"+message.username);
        }

        chatBody.appendChild(chatElement);

        setTimeout(function() {
            chatElement.classList.add("showing");
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);
    }

    socket.on('new message', function(msg) {
        addChatMessage(msg, false);
    });

    socket.on('typing', function(msg) {
        addChatMessage({message: "...", username: msg.username}, false, true);
    });

    socket.on('stop typing', function(msg) {
        removeTypingBubble(msg.username, msg.commit)
    });

    function removeTypingBubble(username, commit) {
        var typingMessages = document.querySelectorAll(".typingMessage.user-"+username);

        for (var i = 0; i<(typingMessages.length); i++) {
            if (commit) {
                typingMessages[i].style.display = "none";
            } else {
                typingMessages[i].classList.remove("showing");
            }
        }

        setTimeout(function() {
            for (var i = 0; i<(typingMessages.length); i++) {
                chatBody.removeChild(typingMessages[i]);                
            }
        }, 300);
    }

    socket.on('clientsChanged', function (msg) {

        if (msg && msg > 1) {
            userCountElement.innerText = msg;
            userCountElement.classList.remove("hidden");
        } else {
            userCountElement.classList.add("hidden");
        }
    });

}


/************* RENDER THE PANE CONTENTS ******************/

function renderTimestamp(hostElement, timestamp) {

    if (hostElement.classList.contains("closedPane")) {
        hostElement.classList.remove("closedPane");
    }

    // Header title
    var headerHTML = hostElement.querySelector('.dockedHeader');
    headerHTML.innerText = timestamp.title;

    var linkHTML = hostElement.querySelector('a.dockedSection');
    if (timestamp.link) {
        linkHTML.classList.remove("hidden");
        linkHTML.innerText = timestamp.link.label;
        linkHTML.setAttribute("href", timestamp.link.url);
        linkHTML.setAttribute("target", "_blank");
    } else { 
        linkHTML.classList.add("hidden");
        linkHTML.innerText = "";
        linkHTML.setAttribute("href", null);
    }

    var timestampHTML = hostElement.querySelector('.tutorialContent');
    timestampHTML.innerHTML = "";

    var descriptionHTML = renderDescription(timestamp.description);
    if (descriptionHTML) timestampHTML.appendChild(descriptionHTML);

    var listHTML = renderList(timestamp.list);
    if (listHTML) timestampHTML.appendChild(listHTML);

    var orderedListHTML = renderOrderedList(timestamp.orderedList);
    if (orderedListHTML) timestampHTML.appendChild(orderedListHTML);

    
    
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
