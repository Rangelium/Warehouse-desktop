const electron = require("electron");
const { ipcRenderer, BrowserWindow } = electron;
window.$ = window.jQuery = require("jquery");

// ====================================================================================
//  													   Utils part
// ====================================================================================

const { MyTreeView } = require("../../tools/TreeView");
const moment = require("moment");

// ====================================================================================
//  													   Connection system part
// ====================================================================================

const mssql = require("mssql");
const { connConfig } = require("../../tools/ConnectionConfig");

let pool = new mssql.ConnectionPool(connConfig);
let poolConnect = pool.connect();

// ====================================================================================
//  														Switch pages system part
// ====================================================================================

// Takes as parameter name of file, note that the name of html file, js file,
// and name of the folder of page must be the same
function openPage(name) {
	// If already opened do not open
	if ($("main").attr("class") == name) {
		return;
	}

	// Set actrive item in anbar
	$(".nav-link").attr("data-active", "false");
	if ($(`.nav-link[data-name=${name}]`).length === 0) {
		$(`[data-name=${name}]`).parent().parent().attr("data-active", "true");
	} else {
		$(`.nav-link[data-name=${name}]`).attr("data-active", "true");
	}

	let promise = new Promise((resolve) => {
		// Load content of page
		$("main").load(`pages/${name}/${name}.html`, () => {
			resolve();
		});
	}).then(() => {
		$(function () {
			// Setting current page script
			$("body").append(
				`<script id="pageScript" src="pages/${name}/${name}.js"></script>`
			);
		});
	});

	// Removing prev page's script
	try {
		$("#pageScript").remove();
	} catch (error) {}

	// Changing attribute of main to differ pages
	$("main").attr("class", name);
}

// Handle switching pages
ipcRenderer.on("changeAnbarPage", (e, page) => {
	openPage(page);
});

// ====================================================================================
//  														Navigation bar part
// ====================================================================================

ipcRenderer.on("createNavBar", (e, menuItems) => {
	menuItems = JSON.parse(menuItems);

	// Create main pages
	for (let i = 0; i < menuItems.length; i++) {
		// Set up settings if added
		if (menuItems[i].role == "settings") {
			// Free space for settings menu
			$(".nav-links").css("width", "80%");

			// Create element
			$("nav").append(
				`<ul class="settings-container"><li data-isClicked="false" data-id="${menuItems[i].id}" class="settings"><p>${menuItems[i].label}</p></li></ul>`
			);
			// Handle click event
			$(".settings").click(function (event) {
				if ($(this).attr("data-isClicked") == "false") {
					$(this).attr("data-isClicked", "true");
					$(".settings-container > .dropdown").attr("data-isOpened", "true");
				} else {
					$(this).attr("data-isClicked", "false");
					$(".settings-container > .dropdown").attr("data-isOpened", "false");
				}
				event.stopPropagation();
			});
			$(document).click(() => {
				if ($(".settings").attr("data-isClicked") == "true") {
					$(".settings").attr("data-isClicked", "false");
					$(".settings-container > .dropdown").attr("data-isOpened", "false");
				}
			});

			// Creating submenus
			let parent = $(`.settings-container`);
			let dropdown = "<ul data-isOpened='false' class='dropdown'>";
			for (let j = 0; j < menuItems[i].submenu.length; j++) {
				dropdown += `<li title="${
					menuItems[i].submenu[j].shortcut == undefined
						? ""
						: menuItems[i].submenu[j].shortcut.toUpperCase()
				}" data-id="${menuItems[i].submenu[j].id}"><p>${
					menuItems[i].submenu[j].label
				}</p></li>`;
			}
			dropdown += "</ul>";
			parent.append(dropdown);
			$(".settings-container > .dropdown").css(
				"max-height",
				menuItems[i].submenu.length * 50
			);

			for (let j = 0; j < parent.children().last().children().length; j++) {
				$(parent.children().last().children()[j]).click(function () {
					ipcRenderer.send("navBarClicks", $(this).attr("data-id"));
				});
			}

			continue;
		}

		// Creating element of nav bar
		$(".nav-links").append(
			`<li class="nav-link" data-name="${menuItems[i].name}" data-id=${
				menuItems[i].id
			} data-hasDropdown="${menuItems[i].submenu !== undefined ? true : false}" title="${
				menuItems[i].shortcut == undefined ? "" : menuItems[i].shortcut.toUpperCase()
			}" data-active="false"><p>${menuItems[i].label}</p></li>`
		);
		// Adding click event handler
		$(".nav-links")
			.children()
			.last()
			.click(function () {
				if ($(this).attr("data-hasDropdown") == "false") {
					ipcRenderer.send("navBarClicks", $(this).attr("data-id"));
				}
			});

		// Creating submenus
		if (menuItems[i].submenu !== undefined) {
			let parent = $(`[data-id=${menuItems[i].id}]`);
			let dropdown = "<ul class='dropdown'>";
			for (let j = 0; j < menuItems[i].submenu.length; j++) {
				dropdown += `<li data-name="${menuItems[i].submenu[j].name}" title="${
					menuItems[i].submenu[j].shortcut == undefined
						? ""
						: menuItems[i].submenu[j].shortcut.toUpperCase()
				}" data-id="${menuItems[i].submenu[j].id}"><p>${
					menuItems[i].submenu[j].label
				}</p></li>`;
			}
			dropdown += "</ul>";
			parent.append(dropdown);

			for (let j = 0; j < parent.children().last().children().length; j++) {
				$(parent.children().last().children()[j]).click(function () {
					ipcRenderer.send("navBarClicks", $(this).attr("data-id"));
				});
			}
		}
	}

	// Set Anbar info page as starting
	openPage("anbarInfo");
});
