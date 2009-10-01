jetpack.future.import("slideBar");
jetpack.future.import("storage.simple");

//BEGIN FluidDB REST LIB

fluidDB = new Object();

fluidDB.instance = {
    main : "http://fluiddb.fluidinfo.com/",
    sandbox : "http://sandbox.fluidinfo.com/"
}


fluidDB.choose = function(type){
    //add error handling
    fluidDB.baseURL = fluidDB.instance[type];
}

fluidDB.choose('main');

fluidDB.ajax = function(type, url, payload, callback, async_req){
    if(async_req == undefined){
      async_req = true;
    }
    $.ajax({
          async: async_req,
          beforeSend: function(xhrObj){
              if(fluidDB.baseURL == fluidDB.instance['main']){
                  xhrObj.setRequestHeader("Accept","application/json");
              };
              xhrObj.setRequestHeader("Content-Type","application/json");
          },
          contentType: "application/json",
          type: type,
          url: url,
          data: payload,
          processData: false,
          success: callback
    });
}

fluidDB.get = function(url, callback, async_req){
    fluidDB.ajax("GET", fluidDB.baseURL+url, null, callback, async_req);
}

fluidDB.post = function(url, payload, callback, async_req){
    fluidDB.ajax("POST", fluidDB.baseURL+url, payload, callback, async_req);
}


//END FluidDB REST LIB

// Add our content to the slidebar.
jetpack.slideBar.append({
  onReady: function (slide) {

    // Remove the shown note when the user clicks the remove-note button.
    $("#saveButton", slide.contentDocument).click(function () {
			jetpack.storage.simple.set( "username", $("#username").val ); 
			jetpack.storage.simple.set( "password", $("#password").val ); 
			jetpack.notifications.show($("#username").val);        
			jetpack.notifications.show($("#password").val);        
    });

  },

  width: 150,
  persist: true,

  // This automagically becomes our slidebar content.
  html: <>
    <style><![CDATA[
      body {
        background: #fff;
        color: #222;
        font-family: sans-serif;
        font-size: 10pt;
      }
      h1 {
        font-size: 10pt;
        text-align: center;
      }
      textarea {
        width: 100%;
      }
      #settingsArea {
        padding: 1em;
        -moz-border-radius: 5px;
        background: #ccf;
      }
      #noteTime {
        margin: 0;
        font-weight: bold;
      }
      #saveButton {
        color: #833;
        padding-top: 1em;
        font-weight: bold;
        cursor: pointer;
      }
      #newNoteButton {
        background: #ffa;
        color: #330;
        margin: 1em 0;
        padding: 0.5em;
        -moz-border-radius: 5px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
      }
      .noteButton {
        background: #ddd;
        color: #333;
        margin: 1em 0;
        padding: 0.5em;
        -moz-border-radius: 5px;
        cursor: pointer;
      }
      .noteButtonTime {
         font-weight: bold;
      }
    ]]></style>
    <body>
      <h1>Borthwick Remember Button</h1>
      <div id="settingsArea">
        <div><input id="username" type="text" /></div>
        <div><input id="password" type="password" /></div>
        <div id="saveButton">Save credentials</div>
      </div>
    </body>
  </>
});


jetpack.statusBar.append({
	//need to change to BRB icon...
  html: '<b>BRB</b>',
  onReady: function(doc) {
    $(doc).find("b").click(function() {
      if (true) { //TODO check if it already exists
        jetpack.notifications.show("Noted");
				
      } else { //remove the tag
        jetpack.notifications.show("Removed"); 
				
      }
    });
  }
});
