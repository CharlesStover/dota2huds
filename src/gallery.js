if (typeof(HUDs) == "object") {

	var current = "default",
		header = document.getElementsByTagName("head").item(0),
		market = document.getElementById("market"),
		middle = document.getElementById("middle"),
		permalink = document.getElementById("permalink"),
		select = document.createElement("select"),
		option, style, x;

	// For each HUD,
	for (id in HUDs) {

		// ["Name", "Style"] or [false, "Name"] for no style.
		if (typeof(HUDs[id]) == "object") {
			for (x = 1; x < HUDs[id].length; x++)
				HUDs[id][x] = HUDs[id][0] + (HUDs[id][x] ? " (" + HUDs[id][x] + ")" : "");
		}
		else
			HUDs[id] = [false, HUDs[id]];

		for (x = 1; x < HUDs[id].length; x++) {

			var safeId = id.replace(/[^\d\w]+/g, "_");
			HUDs[safeId] = HUDs[id];
			if (x > 1)
				safeId += "---" + (x - 1);

			// <link />
			if (id != "default") {
				style = document.createElement("link");
				style.disabled = true;

				// ../ because pushstate changes URL to /hud_skins/hud_id/
				style.setAttribute("href", /*"../" +*/ id.replace(/\s/g, "+") + "/style" + (x > 1 ? x - 1 : "") + ".css");
				style.setAttribute("id", safeId);
				style.setAttribute("media", "screen");
				style.setAttribute("rel", "alternate stylesheet");
				style.setAttribute("title", HUDs[id][x]);
				style.setAttribute("type", "text/css");
				header.appendChild(style);
			}

			// <option>
			option = document.createElement("option");
			if (id == "default")
				option.setAttribute("selected", "selected");
			option.setAttribute("value", safeId);
			option.appendChild(document.createTextNode(HUDs[id][x]));
			select.appendChild(option);
		}
	}

	// onchange
	var change = function(id, alt) {
			if (typeof(id) != "string") {
				id = this.options[this.selectedIndex].getAttribute("value");
				if (id.match(/\-\-\-\d+$/)) {
					var alt = id.match(/\-\-\-(\d+)$/)[1];
					id = id.split(/\-\-\-/)[0];
				}
				else
					alt = false;
				market.setAttribute(
					"href",
					"http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&category_570_Slot%5B%5D=any&category_570_Type%5B%5D=tag_hud_skin&appid=570" + (id != "default" ? "&q=" + HUDs[id][HUDs[id][0] ? 0 : 1] : "")
				);
			}
			else if (typeof(alt) != "number")
				alt = false;
			permalink.setAttribute(
				"href",
				// directory nav due to pushstate: (location.href.match(/\/hud\_skins\/(?:index\.html)?$/) ? "" : "../") +
				document.getElementById(id).getAttribute("href").replace(/style\.css$/, "") +
				(alt ? "?style=" + alt : "")
			);
			document.getElementById(current).disabled = true;
			current = id + (alt ? "---" + alt : "");
			document.getElementById(current).disabled = false;
			//history.pushState({id: id, alt: alt, selectedIndex: this.selectedIndex}, HUDs[id][alt ? alt + 1 : 1], permalink.getAttribute("href"));
		};
	select.addEventListener("change", change);
	change("default");

	// popstate
	window.addEventListener(
		"popstate",
		function(event) {
			select.selectedIndex = event.state.selectedIndex;
			change(event.state.id, event.state.alt);
		}
	);

	// <select>
	middle.insertBefore(select, middle.getElementsByTagName("div").item(1));
}