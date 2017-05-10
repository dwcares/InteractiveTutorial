# Interactive Tutorial - Azure Media Services playback control for interactive tutorial playback

![Interactive Tutorial Playback Example](http://microsoft.github.io/techcasestudies/images/2017-01-19-makerskit/makerskit-dynamic-content.gif)

This project demonstrates how to implement a real-time tutorial playback solution built on top of Azure Media Services and Azure Media Player using 

> Note: This example requires an Azure Media Services instance, and a Node.js server with WebSockets enabled.

## Code Example

```javascript
  this.addEventListener('timestampchanged', 
  
  function(e) {
    currentTimestampIndex = e.updatedTimestampIndex;
    renderTimestamp(tutorialPane, videoData.timestamps[e.updatedTimestampIndex]);
  });
```

## Additional resources ##

### Reference Documentation ###
* [Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service-web/)
* [Azure Node.js Development Center](https://azure.microsoft.com/en-us/develop/nodejs/)
* [Building Real-time Chat in Socket.io (MSDN)](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-nodejs-chat-app-socketio)
* [Azure Media Services](https://docs.microsoft.com/en-us/azure/media-services)
* [Get started with Node.js web apps on Azure App Service (Tutorial)](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-get-started-nodejs)
* [Deploy a Node.js web app from Github (Video)](https://azure.microsoft.com/en-us/resources/videos/create-a-nodejs-site-deploy-from-github/).

### Demo Site ###
[http://makerskit.azurewebsites.net](http://makerskit.azurewebsites.net)

### Technical Case Study ###
[Microsoft Tech Case Studies - MakersKit](https://microsoft.github.io/techcasestudies/azure%20app%20service/2017/03/09/makerskit.html)

### Demo Video ###
[![MakersKit Demo Video Thumbnail](http://microsoft.github.io/techcasestudies/images/2017-01-19-makerskit/makerskit-video-thumb.png)](https://channel9.msdn.com/Blogs/raw-tech/MakersKit-Interactive-Player)


## Contributors
This project was implemented at a hackfest with MakersKit.

* David Washington [@dwcares](http://twitter.com/dwcares) – Microsoft
* Mike Stone ([@makerskit](https://twitter.com/makerskit)) – MakersKit
* Alex Froelich ([@froeal01](https://twitter.com/froeal01)) – MakersKit