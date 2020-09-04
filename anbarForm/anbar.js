const electron = require("electron");
const { ipcRenderer } = electron;
const { sha256 } = require("../tools/sha256");
const { MyCustomMenu } = require("../tools/customMenu");
window.$ = window.jQuery = require("jquery");
const ssrs = require("mssql-ssrs");

// ====================================================================================
//  													   Utils part
// ====================================================================================

const { MyTreeView } = require("../tools/TreeView");
const moment = require("moment");
var USER = {
	id: 1,
};

setTimeout(() => {
	userLoggedIn();
	openPage("anbarInfo");
}, 200);

// ====================================================================================
//  													   Connection system part
// ====================================================================================

const mssql = require("mssql");
const { connConfig } = require("../tools/ConnectionConfig");
const { shell } = require("electron");

let pool = new mssql.ConnectionPool(connConfig);
let poolConnect = pool.connect();

function getTranslations() {
	languages = {};
	poolConnect.then((pool) => {
		pool.request().execute("anbar.language_translations", (err, res) => {
			if (err !== null) console.log(err);
			data = res.recordset;
			data.forEach((el) => {
				languages[el.key_value] = el.settingLanguage;
			});
			return languages;
		});
	});
}
getTranslations();

// ====================================================================================
//  														    Login system
// ====================================================================================

function showLoginForm() {
	$("nav").css("opacity", "0");
	$("nav").css("pointer-events", "none");
	$("main").css("opacity", "0");
	$("main").css("pointer-events", "none");

	$(".login-section").css("opacity", "1");
	$(".login-section").css("pointer-events", "all");
}

// Main login process
$("form").submit((e) => {
	e.preventDefault();

	if ($("#username").val().length === 0 || $("#password").val().length === 0) {
		return;
	}

	poolConnect
		.then((pool) => {
			pool
				.request()
				.input("username", mssql.NVarChar(250), $("#username").val())
				.input("password", mssql.NVarChar(250), sha256($("#password").val()))
				.execute("anbar.user_login_check", (err, res) => {
					if (res.recordset[0][""] == 1) {
						pool
							.request()
							.input("username", mssql.NVarChar(250), $("#username").val())
							.execute("anbar.user_select_info", (err, res) => {
								console.log(res);
								USER = res.recordset[0];
							});
						userLoggedIn();
						$("#username").val("");
						$("#password").val("");
						return;
					} else {
						// Handling wrond input
						$(".invalidData").css("opacity", "1");
						$("#password").val("");
						setTimeout(() => {
							$(".invalidData").css("opacity", "0");
						}, 4000);
					}
				});
		})
		.catch((err) => console.log(err));
});

// Set up login page design
setInterval(() => {
	if ($("#username").val().length > 0) {
		$("#username").attr("data-active", "true");
	} else {
		$("#username").attr("data-active", "false");
	}
	if ($("#password").val().length > 0) {
		$("#password").attr("data-active", "true");
	} else {
		$("#password").attr("data-active", "false");
	}
}, 100);

function userLoggedIn() {
	$("nav").css("opacity", "1");
	$("nav").css("pointer-events", "all");
	$("main").css("opacity", "1");
	$("main").css("pointer-events", "all");

	$(".login-section").css("opacity", "0");
	$(".login-section").css("pointer-events", "none");
}

ipcRenderer.on("userLogOut", () => {
	openPage("anbarInfo");
	showLoginForm();
});

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
			} data-hasDropdown="${
				menuItems[i].submenu !== undefined ? true : false
			}" title="${
				menuItems[i].shortcut == undefined
					? ""
					: menuItems[i].shortcut.toUpperCase()
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

// Generate Table Function For Logs Currency Exchange UserList Measurments
function generateTableHead(table, columnNames) {
	let thead = table.createTHead();
	let headRow = thead.insertRow();
	for (let name in columnNames) {
		let th = document.createElement("th");
		let text = document.createTextNode(columnNames[name]);
		th.appendChild(text);
		headRow.appendChild(th);
	}
}

function generateTable(table, data) {
	for (let element of data) {
		let row = table.insertRow();
		for (key in element) {
			if (key == "id") continue;
			let cell = row.insertCell();
			let text = document.createTextNode(element[key]);
			cell.appendChild(text);
		}
	}
}
