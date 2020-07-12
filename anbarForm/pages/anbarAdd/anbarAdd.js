// =====================================================================================
//                                    UTIL FUNCTIONS
// =====================================================================================

async function showAlert(message) {
	$("#alertMessage").html(message);
	$(".cstmAlertBox").css({
		display: "flex",
		opacity: "1",
		width: "30%",
		height: "30%",
	});
	$(".anbarAdd-container").css({
		filter: "brightness(40%)",
		"pointer-events": "none",
	});

	return await new Promise((resolve) => {
		$("#alertYes").click(() => {
			resolve(true);
		});
		$("#alertNo").click(() => {
			resolve(false);
		});
	});
}
function closeAlert() {
	$(".cstmAlertBox").css({
		opacity: "0",
		width: "0",
		height: "0",
	});
	$(".anbarAdd-container").css({
		filter: "brightness(100%)",
		"pointer-events": "all",
	});
	setTimeout(() => {
		$(".cstmAlertBox").css("display", "none");
	}, 600);
}

$(".closedState").click(function () {
	$(this).attr("data-isClicked", "True");
	setTimeout(() => {
		$(".openedState").attr("data-isClicked", "True");
	}, 500);
});
$(document).click((el) => {
	if (
		el.target !== $(".closedState")[0] &&
		$.inArray(el.target, $(".closedState").children())
	) {
		$(".openedState").attr("data-isClicked", "False");
		$(".closedState").attr("data-isClicked", "False");
	}
});

// =====================================================================================
//                                   MoveableBorder part
// =====================================================================================

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function (event) {
	currentMousePos.x = parseInt(event.pageX);
	currentMousePos.y = parseInt(event.pageY);
});

var timeout,
	clickObj = $(".moveableBorder");
var prevMouseY = null;
var moveLineBy = null;
clickObj.mousedown(function () {
	timeout = setInterval(function () {
		if (prevMouseY !== currentMousePos.y) {
			moveLineBy += currentMousePos.y - $(".moveableBorder").offset().top;
			moveBlockBy =
				parseInt($(".bulks").css("height").slice(0, -2)) + moveLineBy;
			if (
				moveBlockBy < $(document).height() * 0.65 &&
				moveBlockBy > $(document).height() * 0.15
			) {
				prevMouseY = currentMousePos.y;
				$(".moveableBorder").css("top", moveLineBy);
				$(".bulks").css("height", moveBlockBy);
			} else {
				moveLineBy -= currentMousePos.y - $(".moveableBorder").offset().top;
			}
		}
	}, 1);

	return false;
});

$(".moveableBorder").dblclick(function () {
	moveLineBy = null;
	prevMouseY = null;
	$(".moveableBorder").css("top", moveLineBy);
	$(".bulks").css("height", "50%");
});

$(document).mouseup(function () {
	clearInterval(timeout);
	return false;
});

// =====================================================================================
//                                   Main part
// =====================================================================================

// Bulks part
function fillBulksTable(data) {
	$(".anbarAddBulksTable").remove();

	$(".bulks-table").append("<table class='anbarAddBulksTable'></table>");
	$(".anbarAddBulksTable").append("<thead></thead>");
	$(".anbarAddBulksTable").append("<tbody></tbody>");

	$(".anbarAddBulksTable > thead").append(`<th>Begin date:</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>Seller:</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>Whole price:</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>Cost price:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-bulk" data-id='${el.id}'>`;

		row += `<td title="${moment(el.begin_date).format(
			"DD MMMM YYYY, h:mm:ss"
		)}">${moment(el.begin_date).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.seller}</td>`;
		row += `<td>${el.whole_price}</td>`;
		row += `<td>${el.cost_price}</td>`;

		row += "</tr>";
		$(".anbarAddBulksTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 9) {
		for (let i = 0; i < 9 - data.length; i++) {
			let row = "<tr class='empty-single-bulk' style='height: 40px'>";

			for (let j = 0; j < 4; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarAddBulksTable > tbody").append(row);
		}
	}

	$(".single-bulk").click(function () {
		$(".single-bulk").attr("data-isSelected2", "False");
		$(this).attr("data-isSelected2", "True");
		getBulkSessions($(this).attr("data-id"));
	});
	$(".single-bulk").contextmenu(function () {
		showSingleBulkOptions($(this));
	});
	$(".empty-single-bulk").contextmenu(function () {
		showSingleBulkOptions($(this));
	});
}
function getAllBulks(date_from, date_to) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("date_from", date_from)
			.input("date_to", date_to)
			.execute("dbo.bulk_buying_selection", (err, res) => {
				if (err !== null) console.log(err);
				fillBulksTable(res.recordset);
			});
	});
}
function refreshBulksTable(timeout = 0) {
	setTimeout(() => {
		getAllBulks(
			moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
			moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
		);
	}, timeout);
}
function deleteBulk(id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", id)
			.execute("dbo.bulk_buying_delete", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function addNewBulk(begin_date, seller_id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("begin_date", begin_date)
			.input("seller_id", seller_id)
			.execute("dbo.bulk_buying_create", (err) => {
				if (err !== null) console.log(err);
				return;
			});
	});
}
async function showAddNewBulkForm() {
	// Preparing form
	$("#addNewBulkSellers").empty();
	let sellersData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.product_sellers_select", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < sellersData.length; i++) {
		$("#addNewBulkSellers").append(
			`<option data-id="${sellersData[i].id}">${sellersData[i].seller}</option>`
		);
	}

	let now = new Date();
	let day = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	let today = now.getFullYear() + "-" + month + "-" + day;
	$("#addNewBulkBeginDate").val(today);

	// Showing Form
	$(".anbarAdd-container").css({
		"pointer-events": "none",
	});
	$(".addNewBulkForm").css({
		opacity: "1",
		display: "flex",
		"pointer-events": "all",
	});
	$(".addNewBulkForm").attr("data-isActive", "True");
}
function hideAddNewBulkForm() {
	$(".anbarAdd-container").css({
		"pointer-events": "all",
	});
	$(".addNewBulkForm").css({
		opacity: "0",
	});
	$(".addNewBulkForm").attr("data-isActive", "False");
	setTimeout(() => {
		$(".addNewBulkForm").css("display", "none");
	}, 600);
}
$("#addNewBulkDiscardBtn").click(() => {
	hideAddNewBulkForm();
});
$("#addNewBulkSubmitBtn").click(() => {
	addNewBulk(
		moment($("#addNewBulkBeginDate").val()).format("yyyy-MM-DD HH:mm:ss"),
		$("#addNewBulkSellers").children("option:selected").attr("data-id")
	);
	refreshBulksTable(600);
	hideAddNewBulkForm();
});
function showSingleBulkOptions(bulkEl) {
	if (bulkEl.attr("class") === "empty-single-bulk") {
		$(".single-bulk").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsDelete").hide();
		$("#optionsMenu").attr("data-belongsTo", "Bulks");
		$("#optionsMenu").css({
			top:
				currentMousePos.y -
				$(document).height() * 0.09 -
				$($(".optionsBtn")[0]).height() / 2 +
				5,
			left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
		});

		$("#optionsNew").attr("title", "Add new session");
		$(".optionsBtn").attr("data-isActive", "True");
		return;
	}

	$(".single-bulk").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");
	$("#optionsDelete").show();
	$("#optionsMenu").attr("data-belongsTo", "Bulks");
	$("#optionsMenu").css({
		top:
			currentMousePos.y -
			$(document).height() * 0.09 -
			$($(".optionsBtn")[0]).height() / 2 +
			5,
		left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
	});
	bulkEl.attr("data-isSelected", "True");
	$("#optionsDelete").attr("data-bulkId", bulkEl.attr("data-id"));
	$("#optionsDelete").attr("title", "Delete bulk");
	$("#optionsNew").attr("title", "Add new bulk");
	$(".optionsBtn").attr("data-isActive", "True");
}
$("#optionsDelete").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Bulks") {
		return;
	}
	showAlert("Are you sure you want to delete this bulk?").then((res) => {
		if (res) {
			deleteBulk($(this).attr("data-bulkId"));
			refreshBulksTable(600);
		}
		closeAlert();
	});
});
$("#optionsNew").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Bulks") {
		return;
	}
	showAddNewBulkForm();
});
$(document).click((el) => {
	$(".single-bulk").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");

	if ($(".addNewBulkForm").attr("data-isActive") === "True") {
		if (
			$(el.target).attr("class") !== "addNewBulkForm" &&
			$.inArray(el.target, $(".addNewBulkForm").children()) < 0 &&
			$.inArray($(el.target).parent()[0], $(".addNewBulkForm").children()) <
				0 &&
			$.inArray(
				$(el.target).parent().parent()[0],
				$(".addNewBulkForm").children()
			) < 0
		) {
			console.log("IN_BULKS");
			hideAddNewBulkForm();
		}
	}
});

// Bulk's sessions part
var selectedBulkId = undefined;
function fillSessionsTable(data) {
	$("#defaultSessionsText").attr("data-isTableShowing", "True");

	$(".anbarAddSessionsTable").remove();

	$(".sessions-table").append("<table class='anbarAddSessionsTable'></table>");
	$(".anbarAddSessionsTable").append("<thead></thead>");
	$(".anbarAddSessionsTable").append("<tbody></tbody>");

	$(".anbarAddSessionsTable > thead").append(`<th>Begin date:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>Cost price:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>Sum price:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>Status:</th>`);

	data.forEach((el) => {
		let row = `<tr class="bulk-session" data-id='${el.id}'>`;

		row += `<td title="${moment(el.begin_date).format(
			"DD MMMM YYYY, h:mm:ss"
		)}">${moment(el.begin_date).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.cost_price}</td>`;
		row += `<td>${el.sum_price}</td>`;
		row += `<td>${el.done === "+" ? "Finished" : "Not Finished"}</td>`;

		row += "</tr>";
		$(".anbarAddSessionsTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 9) {
		for (let i = 0; i < 9 - data.length; i++) {
			let row = "<tr class='empty-bulk-session' style='height: 40px'>";

			for (let j = 0; j < 4; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarAddSessionsTable > tbody").append(row);
		}
	}

	$(".bulk-session").click(function () {
		$(".anbarAddInfo").hide()
		getSessionInfo($(this).attr("data-id"));
	});
	$(".bulk-session").contextmenu(function () {
		showSingleSessionOptions($(this));
	});
	$(".empty-bulk-session").contextmenu(function () {
		showSingleSessionOptions($(this));
	});
}
function getBulkSessions(id) {
	console.log(id);
	selectedBulkId = id;
	poolConnect.then((pool) => {
		pool
			.request()
			.input("bulk_buying_id", id)
			.execute("dbo.bulk_buying_session_selection", (err, res) => {
				if (err !== null) console.log(err);
				fillSessionsTable(res.recordset);
			});
	});
}
function refreshSessionsTable(timeout = 0) {
	setTimeout(() => {
		getBulkSessions(selectedBulkId);
	}, timeout);
}
function deleteSession(session_id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", parseInt(session_id))
			.execute("dbo.bulk_buying_delete_session", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function addNewSession(begin_date) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("bulk_buying_id", selectedBulkId)
			.input("begin_date", begin_date)
			.execute("dbo.bulk_buying_create_new_session", (err) => {
				if (err != null) console.log(err);
			});
	});
}
function showAddNewSessionForm() {
	// Preparing form
	let now = new Date();
	let day = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	let today = now.getFullYear() + "-" + month + "-" + day;
	$("#addNewSessionBeginDate").val(today);

	// Showing Form
	$(".anbarAdd-container").css({
		"pointer-events": "none",
	});
	$(".addNewSessionForm").css({
		opacity: "1",
		display: "flex",
		"pointer-events": "all",
	});
	$(".addNewSessionForm").attr("data-isActive", "True");
}
function hideAddNewSessionForm() {
	$(".anbarAdd-container").css({
		"pointer-events": "all",
	});
	$(".addNewSessionForm").css({
		opacity: "0",
	});
	$(".addNewSessionForm").attr("data-isActive", "False");
	setTimeout(() => {
		$(".addNewSessionForm").css("display", "none");
	}, 600);
}
$("#addNewSessionDiscardBtn").click(() => {
	hideAddNewSessionForm();
});
$("#addNewSessionSubmitBtn").click(() => {
	addNewSession(
		moment($("#addNewSessionBeginDate").val()).format("yyyy-MM-DD HH:mm:ss")
	);
	refreshSessionsTable(600);
	hideAddNewSessionForm();
});
function showSingleSessionOptions(sessionEl) {
	if (sessionEl.attr("class") === "empty-bulk-session") {
		$(".bulk-session").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsDelete").hide();
		$("#optionsMenu").attr("data-belongsTo", "Sessions");
		$("#optionsMenu").css({
			top:
				currentMousePos.y -
				$(document).height() * 0.09 -
				$($(".optionsBtn")[0]).height() / 2 +
				5,
			left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
		});

		$("#optionsNew").attr("title", "Add new session");
		$(".optionsBtn").attr("data-isActive", "True");
		return;
	}

	$(".bulk-session").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");
	$("#optionsDelete").show();
	$("#optionsMenu").attr("data-belongsTo", "Sessions");
	$("#optionsMenu").css({
		top:
			currentMousePos.y -
			$(document).height() * 0.09 -
			$($(".optionsBtn")[0]).height() / 2 +
			5,
		left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
	});
	sessionEl.attr("data-isSelected", "True");
	$("#optionsDelete").attr("data-sessionId", sessionEl.attr("data-id"));
	$("#optionsDelete").attr("title", "Delete session");
	$("#optionsNew").attr("title", "Add new session");
	$(".optionsBtn").attr("data-isActive", "True");
}
$("#optionsDelete").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Sessions") {
		return;
	}
	showAlert("Are you sure you want to delete this session?").then((res) => {
		if (res) {
			deleteSession($(this).attr("data-sessionId"));
			refreshSessionsTable(600);
		}
		closeAlert();
	});
});
$("#optionsNew").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Sessions") {
		return;
	}
	showAddNewSessionForm();
});
$(document).click((el) => {
	$(".bulk-session").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");

	if ($(".addNewSessionForm").attr("data-isActive") === "True") {
		if ($.inArray(el.target, $("#optionsMenu img")) != -1) {
			return;
		}
		if (
			$(el.target).attr("class") !== "addNewSessionForm" &&
			$.inArray(el.target, $(".addNewSessionForm").children()) < 0 &&
			$.inArray($(el.target).parent()[0], $(".addNewSessionForm").children()) <
				0 &&
			$.inArray(
				$(el.target).parent().parent()[0],
				$(".addNewSessionForm").children()
			) < 0
		) {
			console.log("IN_SESSIONS");
			hideAddNewSessionForm();
		}
	}
});

// Single session's info part
function fillSessionInfoTable(data) {
	$(".anbarAddSessionInfoTable").remove();

	$(".session-info-table").append(
		"<table class='anbarAddSessionInfoTable'></table>"
	);
	$(".anbarAddSessionInfoTable").append("<thead></thead>");
	$(".anbarAddSessionInfoTable").append("<tbody></tbody>");

	$(".anbarAddSessionInfoTable > thead").append(`<th>Product:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Quantity:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Unit:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Price for 1:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>For sale price:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Extra charge:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Sum price:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Currency:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Expriration date:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Product cell:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>Reason:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-session-info" data-id='${el.id} data-cluster-id='${el.cluster_id}''>`;

		row += `<td>${el.title[0]}</td>`;
		row += `<td>${el.quantity}</td>`;
		row += `<td>${el.product_unit}</td>`;
		row += `<td>${el["price for 1"]}</td>`;
		row += `<td>${el.for_sale_price}</td>`;
		row += `<td>${el.extra_charge}</td>`;
		row += `<td>${el.sum_price}</td>`;
		row += `<td>${el.title[1]}</td>`;
		row += `<td title="${moment(el.exp_date).format(
			"Da MMMM YYYY, h:mm:ss"
		)}">${moment(el.exp_date).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.product_cell}</td>`;
		row += `<td>${el.reason}</td>`;

		row += "</tr>";
		$(".anbarAddSessionInfoTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 17) {
		for (let i = 0; i < 17 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 11; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarAddSessionInfoTable > tbody").append(row);
		}
	}
}
$("#sessionInfoGoBackBtn").click(() => {
	hideSessionInfo();
	$(".anbarAddInfo").show()
});
function hideSessionInfo() {
	$(".session-info").attr("data-isActive", "false");
}
function showSessionInfo(data) {
	$(".session-info").attr("data-isActive", "true");
	fillSessionInfoTable(data);
}
function getSessionInfo(id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("session_id", id)
			.execute("dbo.bulk_buying_session_info", (err, res) => {
				if (err !== null) console.log(err);
				showSessionInfo(res.recordset);
			});
	});
}

// Date part
$("#date_from").change(function () {
	let date = $(this).val();
	if ($("#date_to").val() !== "") {
		getAllBulks(
			moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
			moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
		);
	}
});
$("#date_to").change(function () {
	if ($("#date_from").val() !== "") {
		getAllBulks(
			moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
			moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
		);
	}
});

(function presetDate() {
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + now.getMonth()).slice(-2);
	var today = now.getFullYear() + "-" + month + "-" + day;
	var month2 = ("0" + (now.getMonth() + 2)).slice(-2);
	var today2 = now.getFullYear() + "-" + month2 + "-" + day;
	$("#date_from").val(today);
	$("#date_to").val(today2);
	getAllBulks(
		moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
		moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
	);
})();
