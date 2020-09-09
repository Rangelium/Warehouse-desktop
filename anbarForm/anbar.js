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
// setTimeout(() => {
// 	userLoggedIn();
// 	openPage("anbarAdd");
// }, 200);

//todo CURRENCY POP UP SECTION
$.get(
	`https://cbar.az/currencies/${moment(new Date()).format("DD.MM.YYYY")}.xml`,
	{},
	function (data) {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.exchange_rate_last", (err, res) => {
				if (err != null) {
					console.log(err);
					return;
				}
				let isChanged = false;
				res.recordset.forEach((elem) => {
					if (elem.title == "AZN") return;
					let currency = $(data).find(`Valute[Code='${elem.title}']`);
					let currencyValue = currency.find("Value").text();
					if (currencyValue != elem.value) {
						isChanged = true;
						$(".currencyPopUpData").append(`
									<div class="currencyPopUpDataRow">
										<p>${elem.title}</p>
										<div class="dataRow">
											<p>OLD:</p>
											<input type="number" disabled value="${elem.value}">
										</div>
										<div class="dataRow">
											<p>NEW:</p>
											<input type="number" name='currencyValue' data-id='${elem.currency_id}' data-title='${elem.title}' value="${currencyValue}">
										</div>
									</div>
								`);
					}
				});
				if (isChanged) $(".sellersPopUpContainer").show();
			});
		});
	}
);

$("#declineCurrencyChanges").click(() => {
	$("#currencyApiPopUp").fadeOut(200);
});

$("#acceptCurrencyChanges").click(() => {
	let inputs = $("input[name='currencyValue']");
	inputs.each(function () {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("currency_id", mssql.Int, $(this).attr("data-id"))
				.input("value", mssql.Float, $(this).val())
				.input("time", mssql.DateTime, new Date())
				.input("user_id", mssql.Int, USER.id)
				.execute("anbar.exchange_rate_insert", (err, res) => {
					if (err != null) {
						console.log(err);
						return;
					}
					$(".sellersPopUpContainer").fadeOut(100);
				});
		});
	});
});

// =======================================================
// setTimeout(() => {
// 	userLoggedIn();
// 	openPage("anbarRemove");
// }, 200);

// ====================================================================================
//  													   Connection system part
// ====================================================================================

const mssql = require("mssql");
const { connConfig } = require("../tools/ConnectionConfig");
// const { shell } = require("electron");

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

var DEFAULTS = {
	language: "AZE",
	currency: "AZN",
};

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
					if (err !== null) console.log(err);
					if (res.recordset[0][""] == 1) {
						pool
							.request()
							.input("username", mssql.NVarChar(250), $("#username").val())
							.execute("anbar.user_select_info", (err, res) => {
								if (err !== null) console.log(err);
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

ipcRenderer.on("openSettings", () => {
	$("#openSettings").show();
});

ipcRenderer.on("downloadReport complete", (event, file) => {
	alert("File is Downloaded");
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

// todo SETTINGS

$("#closeSettings").click(() => {
	$("#openSettings").fadeOut(100);
});

poolConnect.then((pool) => {
	pool.request().execute("anbar.currency_select", (err, res) => {
		if (err != null) {
			console.log(err);
			return;
		}
		for (let i of res.recordset) {
			$("#settingsCurrencySelect").append($("<option>", { value: i.id, text: i.title }));
		}
	});
});

$("#settingCurrencyDropdown").change(function () {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, $(this).val())
			.execute("anbar.settings_change_currency", (err, res) => {
				if (err != null) {
					console.log(err);
					return;
				}
			});
	});
});

$("input[name='language']").change(function () {
	let val = $("input[name='language']:checked").val();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, val)
			.execute("anbar.settings_change_language", (err, res) => {
				if (err != null) {
					console.log(err);
					return;
				}
				getTranslations();
			});
	});
});
