/* Emanuel Carnevale
 emanuelcarnevale.com

*/

jetpack.future.import("slideBar");
jetpack.future.import("storage.simple");

//BEGIN Base64 LIB
// From http://www.webtoolkit.info/javascript-base64.html
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

//END Base64 LIB


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

fluidDB.choose('sandbox');

fluidDB.ajax = function(type, url, payload, callback, async_req, username, password){
    if((username != undefined) && (password != undefined)){
      var authenticate = true;
    }
    
    if(async_req == undefined){
      async_req = true;
    }
    $.ajax({
          async: async_req,
          beforeSend: function(xhrObj){
              if(authenticate){
                  var base64string = username + ":" + password;
                  xhrObj.setRequestHeader("Authorization","Basic "+  Base64.encode(base64string));
              };
              if(fluidDB.baseURL == fluidDB.instance.main){
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

fluidDB.get = function(url, callback, async_req, username, password){
    fluidDB.ajax("GET", fluidDB.baseURL+url, null, callback, async_req, username, password);
}

fluidDB.post = function(url, payload, callback, async_req, username, password){
    fluidDB.ajax("POST", fluidDB.baseURL+url, payload, callback, async_req, username, password);
}

fluidDB.put = function(url, payload, callback, async_req, username, password){
    fluidDB.ajax("PUT", fluidDB.baseURL+url, payload, callback, async_req, username, password);
}


//END FluidDB REST LIB

function initTag(username, password, tag, description) {
		fluidDB.post("tags/"+username, '{"name" : "'+ tag +'", "description" : "' + description + '", "indexed" : false}', function(json){
			jetpack.notifications.show("tag created");
		},
		true,
		username,
		password);
}



// Add our content to the slidebar.
jetpack.slideBar.append({
  onReady: function (slide) {

    // Remove the shown note when the user clicks the remove-note button.
    $("#saveButton", slide.contentDocument).click(function () {
jetpack.storage.simple.username = $("#username", slide.contentDocument).val();
jetpack.storage.simple.password = $("#password", slide.contentDocument).val();
});
$("#username", slide.contentDocument).val(jetpack.storage.simple.username);
$("#password", slide.contentDocument).val(jetpack.storage.simple.password);

  },

  width: 200,
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
      #settingsArea {
        padding: 1em;
        -moz-border-radius: 5px;
        background: #ccf;
      }
      #saveButton {
        color: #833;
        padding-top: 1em;
        font-weight: bold;
        cursor: pointer;
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
  width: 40,
  onReady: function(doc) {
    $(doc).find("b").click(function() {
      if (true) { //TODO check if it already exists
          initTag(jetpack.storage.simple.username,
            jetpack.storage.simple.password,
            "remember",
            "a page I need to remember");
        var pageURL = jetpack.tabs.focused.url;
	fluidDB.post("objects", '{"about" : "'+ pageURL.toString() +'"}', function(json){
          var response = JSON.parse(json);
          var username = jetpack.storage.simple.username;
          var password = jetpack.storage.simple.password;
	  //jetpack.notifications.show(response.id);
          fluidDB.put("objects/"+response.id+"/"+username+"/remember",
                       '{"value" : true }',
                       function(json){
                          jetpack.notifications.show("Remembered for you");
                       },
                       true,
                       username,
                       password);
        });

				
      } else { //remove the tag
        jetpack.notifications.show("Removed"); 
				
      }
    });
  }
});
