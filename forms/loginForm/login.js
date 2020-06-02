const electron = require("electron");
const { ipcRenderer } = electron;

window.$ = window.jQuery = require("jquery");

// Main login process
$("form").submit((e) => {
	e.preventDefault();

	if ($("#username").val().length === 0 || $("#password").val().length === 0) {
		return;
	}

	ipcRenderer.send("userLoginClick", {
		username: $("#username").val(),
		password: $("#password").val(),
	});
});

// handling wrond input
ipcRenderer.on("userLoginFalse", () => {
	$(".invalidData").css("opacity", "1");
	$("#password").val("");
	setTimeout(() => {
		$(".invalidData").css("opacity", "0");
	}, 4000);
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
