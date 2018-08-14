var copies = {}, copied = {},
	copy = function(id) {
		copies[id] = document.getElementById(id),
		copied[id] = document.getElementById(id + "-copied");
		var client = new ZeroClipboard(copies[id]);
		client.on(
			"copy",
			function (event) {
				event.clipboardData.setData("text/plain", copies[id].lastChild.getAttribute("value"));
				copied[id].className = "copied animate";
				setTimeout(
					function() {
						copied[id].className = "copied";
					},
					2500
				);
			}
		);
		return client;
	};

copy("url");
copy("bbcode");
copy("reddit");

// Twitter
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');