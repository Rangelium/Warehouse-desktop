// ======================================================================================================
//                                             UTIL FUNCTIONS

// ======================================================================================================
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

// Anbar info part
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

// ====================================================================================================
//                                         MoveableBorder part
// ====================================================================================================

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
			moveBlockBy = parseInt($(".bulks").css("height").slice(0, -2)) + moveLineBy;
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

// ====================================================================================================
//                                        Page's main part logic
// ====================================================================================================

// ====================================================================================================
//                                            BULKS BLOKS's part
// ====================================================================================================
function fillBulksTable(data) {
	$(".anbarAddBulksTable").remove();

	$(".bulks-table").append("<table class='anbarAddBulksTable'></table>");
	$(".anbarAddBulksTable").append("<thead></thead>");
	$(".anbarAddBulksTable").append("<tbody></tbody>");

	$(".anbarAddBulksTable > thead").append(`<th>${languages["creation_date"]}</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>${languages["seller"]}</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>${languages["total_price"]}:</th>`);
	$(".anbarAddBulksTable > thead").append(`<th>${languages["currency"]}:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-bulk" data-id='${el.id}'>`;

		row += `<td title="${moment(el.begin_date).format("DD MMMM YYYY, h:mm:ss")}">${moment(
			el.begin_date
		).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.seller}</td>`;
		row += `<td>${el.cost_price === null ? "0" : el.cost_price}</td>`;
		row += `<td>${el.default_currency}</td>`;
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
			.execute("anbar.bulk_buying_selection", (err, res) => {
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
			.execute("anbar.bulk_buying_delete", (err) => {
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
			.execute("anbar.bulk_buying_create", (err) => {
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
			pool.request().execute("anbar.product_seller_select_active", (err, res) => {
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
	$("#optionsAccept").hide();
	$("#optionsEndAll").hide();
	$("#optionsEdit").hide();
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
			$.inArray($(el.target).parent()[0], $(".addNewBulkForm").children()) < 0 &&
			$.inArray($(el.target).parent().parent()[0], $(".addNewBulkForm").children()) < 0
		) {
			hideAddNewBulkForm();
		}
	}
});

// ====================================================================================================
//                                       BULKS SESSIONS BLOKS's part
// ====================================================================================================
var selectedBulkId = undefined;
function fillSessionsTable(data) {
	$("#defaultSessionsText").attr("data-isTableShowing", "True");

	$(".anbarAddSessionsTable").remove();

	$(".sessions-table").append("<table class='anbarAddSessionsTable'></table>");
	$(".anbarAddSessionsTable").append("<thead></thead>");
	$(".anbarAddSessionsTable").append("<tbody></tbody>");

	$(".anbarAddSessionsTable > thead").append(`<th>VOEN:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>${languages["creation_date"]}:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>${languages["total_price"]}:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>${languages["currency"]}:</th>`);
	$(".anbarAddSessionsTable > thead").append(`<th>${languages["status"]}:</th>`);

	data.forEach((el) => {
		let row = `<tr class="bulk-session" data-finished='${
			el.done === "+" ? true : false
		}' data-voen='${el.session_voen}' data-id='${el.id}'>`;

		row += `<td>${el.session_voen}</td>`;
		row += `<td title="${moment(el.begin_date).format("DD MMMM YYYY, h:mm:ss")}">${moment(
			el.begin_date
		).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.cost_price === null ? "0" : el.cost_price}</td>`;
		row += `<td>${el.default_currency}</td>`;
		row += `<td>${el.done === "+" ? "Finished" : "Not Finished"}</td>`;

		row += "</tr>";
		$(".anbarAddSessionsTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 9) {
		for (let i = 0; i < 9 - data.length; i++) {
			let row = "<tr class='empty-bulk-session' style='height: 40px'>";

			for (let j = 0; j < 5; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarAddSessionsTable > tbody").append(row);
		}
	}

	$(".bulk-session").click(function () {
		if ($(this).attr("data-finished") === "true") {
			return;
		}
		$(".anbarAddInfo").hide();
		getSessionInfo($(this).attr("data-id"), $(this).attr("data-voen"));
	});
	$(".bulk-session").contextmenu(function () {
		showSingleSessionOptions($(this));
	});
	$(".empty-bulk-session").contextmenu(function () {
		showSingleSessionOptions($(this));
	});
}
function getBulkSessions(id) {
	selectedBulkId = id;
	poolConnect.then((pool) => {
		pool
			.request()
			.input("bulk_buying_id", id)
			.execute("anbar.bulk_buying_session_selection", (err, res) => {
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
			.execute("anbar.bulk_buying_delete_session", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function addNewSession(begin_date, session_voen) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("bulk_buying_id", selectedBulkId)
			.input("begin_date", begin_date)
			.input("session_voen", parseInt(session_voen))
			.execute("anbar.bulk_buying_create_new_session", (err) => {
				if (err != null) console.log(err);
			});
	});
}
function acceptAllInsert(bulk_id, session_id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("session_id", parseInt(session_id))
			.input("bulk_buying_id", parseInt(bulk_id))
			.input("user_id", USER.id)
			.execute("anbar.bulk_buying_session_info_accept_insert", (err, res) => {
				if (err !== null) console.log(err);
			});
	});
}
function EndAllSessions(bulk_id) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("bulk_buying_id", parseInt(bulk_id))
			.execute("anbar.bulk_buying_session_end_all", (err, res) => {
				if (err !== null) console.log(err);
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
	if (
		$("#addNewSessionVOEN").val() === "" ||
		!Number.isInteger(parseInt($("#addNewSessionVOEN").val()))
	) {
		console.log("False VOEN");
		return;
	}

	addNewSession(
		moment($("#addNewSessionBeginDate").val()).format("yyyy-MM-DD HH:mm:ss"),
		$("#addNewSessionVOEN").val()
	);
	refreshSessionsTable(600);
	hideAddNewSessionForm();
});
function showSingleSessionOptions(sessionEl) {
	$("#optionsEdit").hide();
	if (sessionEl.attr("class") === "empty-bulk-session") {
		$(".bulk-session").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsAccept").hide();
		$("#optionsDelete").hide();
		$("#optionsEndAll").hide();
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
	$("#optionsAccept").show();
	$("#optionsEndAll").show();
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
	$("#optionsAccept").attr("data-sessionId", sessionEl.attr("data-id"));
	$("#optionsEndAll").attr("title", "End all session infos");
	$("#optionsNew").attr("title", "Add new session");
	$(".optionsBtn").attr("data-isActive", "True");
}
$("#optionsAccept").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Sessions") {
		return;
	}
	showAlert("Are you sure you want to accept all insert in this session?").then((res) => {
		if (res) {
			acceptAllInsert(selectedBulkId, $(this).attr("data-sessionId"));
			refreshSessionsTable(600);
		}
		closeAlert();
	});
});
$("#optionsEndAll").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Sessions") {
		return;
	}
	showAlert("Are you sure you want to accept all sessions in this bulk buying?").then(
		(res) => {
			if (res) {
				EndAllSessions(selectedBulkId);
				refreshSessionsTable(600);
			}
			closeAlert();
		}
	);
});
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
			$.inArray($(el.target).parent()[0], $(".addNewSessionForm").children()) < 0 &&
			$.inArray($(el.target).parent().parent()[0], $(".addNewSessionForm").children()) < 0
		) {
			hideAddNewSessionForm();
		}
	}
});

// ====================================================================================================
//                                       SESSIONS INFO part
// ====================================================================================================
var selectedSessionId = undefined;
var selectedSessionVOEN = undefined;
var selectedSessionInfoObj = undefined;
function fillSessionInfoTable(data) {
	$(".anbarAddSessionInfoTable").remove();

	$(".session-info-table").append("<table class='anbarAddSessionInfoTable'></table>");
	$(".anbarAddSessionInfoTable").append("<thead></thead>");
	$(".anbarAddSessionInfoTable").append("<tbody></tbody>");

	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["product_name"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["quantity"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["unit"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["unit_price"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["total_price"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["currency"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["exp_date"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["product_cell"]}:</th>`);
	$(".anbarAddSessionInfoTable > thead").append(`<th>${languages["action"]}:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-session-info" data-id='${el.id}' data-cluster-id='${el.cluster_id}''>`;

		row += `<td>${el.title[0]}</td>`;
		row += `<td>${el.quantity}</td>`;
		row += `<td>${el.unit_title}</td>`;
		row += `<td>${el["price for 1"]}</td>`;
		row += `<td>${el.sum_price}</td>`;
		row += `<td>${el.title[1]}</td>`;
		row += `<td title="${moment(el.exp_date).format("Da MMMM YYYY, h:mm:ss")}">${moment(
			el.exp_date
		).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.product_cell}</td>`;
		row += `<td>${el.reason}</td>`;

		row += "</tr>";
		$(".anbarAddSessionInfoTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 17) {
		for (let i = 0; i < 17 - data.length; i++) {
			let row = "<tr class='empty-single-session-info' style='height: 40px'>";

			for (let j = 0; j < 9; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarAddSessionInfoTable > tbody").append(row);
		}
	}

	$(".single-session-info").contextmenu(function () {
		showSingleSessionInfoOptions($(this));
	});
	$(".empty-single-session-info").contextmenu(function () {
		showSingleSessionInfoOptions($(this));
	});
}
$("#sessionInfoGoBackBtn").click(() => {
	refreshSessionsTable(600);
	hideSessionInfo();
	$(".anbarAddInfo").show();
});
function hideSessionInfo() {
	$(".session-info").attr("data-isActive", "false");
}
function showSessionInfo(data) {
	$(".session-info").attr("data-isActive", "true");
	fillSessionInfoTable(data);
}
function getSessionInfo(id, voen) {
	selectedSessionId = id;
	selectedSessionVOEN = voen;
	poolConnect.then((pool) => {
		pool
			.request()
			.input("session_id", id)
			.execute("anbar.bulk_buying_session_info", (err, res) => {
				if (err !== null) console.log(err);
				showSessionInfo(res.recordset);
			});
	});
}
function refreshSessionInfoTable(timeout = 0) {
	setTimeout(() => {
		getSessionInfo(selectedSessionId, selectedSessionVOEN);
	}, timeout);
}
function deleteSessionInfo(sessionInfoId) {
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", sessionInfoId)
			.execute("anbar.bulk_buying_session_info_delete", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function addNewSessionInfo() {
	let product_id = parseInt($("#addNewSessionInfo_productId").attr("data-productId"));
	let barcode = parseInt($("#addNewSessionInfo_barcode").val());
	let voen = parseInt($("#addNewSessionInfo_voen").val());
	let quantity = parseInt($("#addNewSessionInfo_quantity").val());
	let price = parseInt($("#addNewSessionInfo_price").val());
	let cluster_id = parseInt(
		$("#addNewSessionInfo_cluster").children("option:selected").attr("data-id")
	);
	let currency_id = parseInt(
		$("#addNewSessionInfo_currency").children("option:selected").attr("data-id")
	);
	let product_cell = parseInt($("#addNewSessionInfo_productCell").val());
	let product_manufacturer = parseInt(
		$("#addNewSessionInfo_productManufacturer")
			.children("option:selected")
			.attr("data-id")
	);
	let exp_date = moment($("#addNewSessionInfo_expDate").val()).format(
		"yyyy-MM-DD HH:mm:ss"
	);
	let reason = $("#addNewSessionInfo_reason").val();
	let session_id = parseInt(selectedSessionId);
	let bulk_id = parseInt(selectedBulkId);

	poolConnect.then((pool) => {
		pool
			.request()
			.input("product_id", product_id)
			.input("quantity", quantity)
			.input("price", price)
			.input("cluster_id", cluster_id)
			.input("exp_date", exp_date)
			.input("reason", reason)
			.input("product_cell", product_cell)
			.input("currency", currency_id)
			.input("product_manufacturer", product_manufacturer)
			.input("barcode", barcode)
			.input("session_id", session_id)
			.input("bulk_buying_id", bulk_id)
			.input("product_voen", voen)
			.execute("anbar.bulk_buying_session_info_insert", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function updateSessionInfo(id) {
	console.log(id);
	return;
	let product_id = parseInt($("#addNewSessionInfo_productId").attr("data-productId"));
	let barcode = parseInt($("#addNewSessionInfo_barcode").val());
	let voen = parseInt($("#addNewSessionInfo_voen").val());
	let quantity = parseInt($("#addNewSessionInfo_quantity").val());
	let price = parseInt($("#addNewSessionInfo_price").val());
	let cluster_id = parseInt(
		$("#addNewSessionInfo_cluster").children("option:selected").attr("data-id")
	);
	let currency_id = parseInt(
		$("#addNewSessionInfo_currency").children("option:selected").attr("data-id")
	);
	let product_cell = parseInt($("#addNewSessionInfo_productCell").val());
	let product_manufacturer = parseInt(
		$("#addNewSessionInfo_productManufacturer")
			.children("option:selected")
			.attr("data-id")
	);
	let exp_date = moment($("#addNewSessionInfo_expDate").val()).format(
		"yyyy-MM-DD HH:mm:ss"
	);
	let reason = $("#addNewSessionInfo_reason").val();
	let session_id = parseInt(selectedSessionId);
	let bulk_id = parseInt(selectedBulkId);

	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", id)
			.input("product_id", product_id)
			.input("quantity", quantity)
			.input("price", price)
			.input("cluster_id", cluster_id)
			.input("exp_date", exp_date)
			.input("reason", reason)
			.input("product_cell", product_cell)
			.input("currency", currency_id)
			.input("barcode", barcode)
			.input("user_id", USER.id)
			.execute("anbar.bulk_buying_session_info_insert", (err) => {
				if (err !== null) console.log(err);
			});
	});
}
function addNewSessionInfoFormValidation() {
	let arr = $(".addNewSessionInfoForm input");
	for (let i = 0; i < arr.length; i++) {
		if ($(".addNewSessionInfoForm").attr("data-forUpdate") === "true") {
			if ($(arr[i]).attr("id") === "addNewSessionInfo_barcode") continue;
		}
		if ($(arr[i]).val() === "") {
			return false;
		}
	}

	let tmp_val = $("#addNewSessionInfo_productId").attr("data-productId");
	if (tmp_val === undefined || tmp_val === "") {
		return false;
	}

	return true;
}
function addNewSessinoInfoFormEmptyInputs() {
	$("#addNewSessionInfo_productId").attr("data-productId", "");
	let arr = $(".addNewSessionInfoForm input");
	for (let i = 0; i < arr.length; i++) {
		if ($(arr[i]).attr("type") !== "date") {
			$(arr[i]).val("");
		}
	}

	$("#addNewSessionInfo_reason").val("");
}
async function showAddNewSessionInfoForm() {
	// Preparing form
	let now = new Date();
	let day = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 3)).slice(-2);
	let date = now.getFullYear() + "-" + month + "-" + day;
	$("#addNewSessionInfo_expDate").val(date);

	$("#addNewSessionInfo_cluster").empty();
	let clustersData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.cluster_names_select_all", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < clustersData.length; i++) {
		$("#addNewSessionInfo_cluster").append(
			`<option data-id="${clustersData[i].id}">${clustersData[i].title}</option>`
		);
	}

	$("#addNewSessionInfo_currency").empty();
	let currencyData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.currency_select", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < currencyData.length; i++) {
		$("#addNewSessionInfo_currency").append(
			`<option data-id="${currencyData[i].id}" title="${currencyData[i].full_title}">${currencyData[i].title}</option>`
		);
	}

	$("#addNewSessionInfo_productManufacturer").empty();
	let manufacturerData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.product_manufacturer_select_all", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < manufacturerData.length; i++) {
		$("#addNewSessionInfo_productManufacturer").append(
			`<option data-id="${manufacturerData[i].id}">${manufacturerData[i].title}</option>`
		);
	}

	$("#addNewSessionInfo_productId").css("pointer-events", "all");
	$("#addNewSessionInfo_barcode").css("pointer-events", "all");
	$("#addNewSessionInfo_voen").css("pointer-events", "none");
	$("#addNewSessionInfo_voen").val(selectedSessionVOEN);

	// Showing Form
	$(".anbarAdd-container").css({
		"pointer-events": "none",
	});
	$(".session-info").css({
		"pointer-events": "none",
	});
	$(".addNewSessionInfoForm").css({
		opacity: "1",
		display: "flex",
		"pointer-events": "all",
	});
	$(".addNewSessionInfoForm").attr("data-isActive", "True");
}
function hideAddNewSessionInfoForm() {
	$(".anbarAdd-container").css({
		"pointer-events": "all",
	});
	$(".session-info").css({
		"pointer-events": "all",
	});
	$(".addNewSessionInfoForm").css({
		opacity: "0",
	});
	$(".addNewSessionInfoForm").attr("data-isActive", "False");
	addNewSessinoInfoFormEmptyInputs();
	setTimeout(() => {
		$(".addNewSessionInfoForm").css("display", "none");
	}, 600);
}
$("#addNewSessionInfoDiscardBtn").click(() => {
	hideAddNewSessionInfoForm();
});
$("#addNewSessionInfoSubmitBtn").click(() => {
	if (!addNewSessionInfoFormValidation()) {
		console.log("Fill all inputs");
		return;
	}
	if ($(".addNewSessionInfoForm").attr("data-forUpdate") === "true") {
		updateSessionInfo($(".addNewSessionInfoForm").attr("data-updatedSessionInfoId"));
		$(".addNewSessionInfoForm").attr("data-forUpdate", "false");
	} else {
		addNewSessionInfo(
			moment($("#addNewSessionInfoBeginDate").val()).format("yyyy-MM-DD HH:mm:ss")
		);
	}
	refreshSessionInfoTable(600);
	hideAddNewSessionInfoForm();
});
function showSingleSessionInfoOptions(sessionInfoEl) {
	$("#optionsAccept").hide();
	$("#optionsEndAll").hide();
	if (sessionInfoEl.attr("class") === "empty-single-session-info") {
		$(".single-session-info").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsDelete").hide();
		$("#optionsEdit").hide();
		$("#optionsMenu").attr("data-belongsTo", "SessionsInfo");
		$("#optionsMenu").css({
			top:
				currentMousePos.y -
				$(document).height() * 0.09 -
				$($(".optionsBtn")[0]).height() / 2 +
				5,
			left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
		});

		$("#optionsNew").attr("title", "Add new product income");
		$(".optionsBtn").attr("data-isActive", "True");
		return;
	}

	selectedSessionInfoObj = sessionInfoEl;
	$(".single-session-info").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");
	$("#optionsDelete").show();
	$("#optionsEdit").show();
	$("#optionsMenu").attr("data-belongsTo", "SessionsInfo");
	$("#optionsMenu").css({
		top:
			currentMousePos.y -
			$(document).height() * 0.09 -
			$($(".optionsBtn")[0]).height() / 2 +
			5,
		left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
	});
	sessionInfoEl.attr("data-isSelected", "True");
	$("#optionsDelete").attr("data-sessionInfoId", sessionInfoEl.attr("data-id"));
	$("#optionsDelete").attr("title", "Delete product income");
	$("#optionsEdit").attr("title", "Edit session info");
	$("#optionsNew").attr("title", "Add new product income");
	$(".optionsBtn").attr("data-isActive", "True");
}
$("#optionsDelete").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "SessionsInfo") {
		return;
	}
	showAlert("Are you sure you want to delete this session's product income?").then(
		(res) => {
			if (res) {
				deleteSessionInfo($(this).attr("data-sessionInfoId"));
				refreshSessionInfoTable(600);
			}
			closeAlert();
		}
	);
});
$("#optionsNew").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "SessionsInfo") {
		return;
	}
	showAddNewSessionInfoForm();
});
$("#optionsEdit").click(async function () {
	$(".addNewSessionInfoForm").attr("data-forUpdate", "true");
	await showAddNewSessionInfoForm();

	let sessionInfoItemsArr = selectedSessionInfoObj.children();
	let id = selectedSessionInfoObj.attr("data-id");
	let tmp = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("title", $(sessionInfoItemsArr[0]).html())
				.execute("anbar.bulk_buying_session_info_search", (err, res) => {
					resolve(res.recordset[0]);
				});
		});
	});

	$(".addNewSessionInfoForm").attr("data-updatedSessionInfoId", id);

	$("#addNewSessionInfo_productId").css("pointer-events", "none");
	$("#addNewSessionInfo_productId").attr("data-productId", tmp.product_id);
	$("#addNewSessionInfo_productId").val(tmp.title);

	$("#addNewSessionInfo_barcode").css("pointer-events", "none");
	$("#addNewSessionInfo_barcode").val(tmp.barcode);

	$("#addNewSessionInfo_quantity").val($(sessionInfoItemsArr[1]).html());
	$("#addNewSessionInfo_price").val($(sessionInfoItemsArr[3]).html());
	$("#addNewSessionInfo_productCell").val($(sessionInfoItemsArr[9]).html());
	$("#addNewSessionInfo_reason").val($(sessionInfoItemsArr[10]).html());
});
$(document).click((el) => {
	$(".bulk-session").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");

	if ($(".anbarAddToTreeForm").attr("data-isActive") === "true") {
		if (
			el.target === $("#addNewSessionInfoDropDownAddNewproductToTreeBtn")[0] ||
			el.target === $("#addNewSessionInfoDropDownAddNewproductToTreeBarcodeBtn")[0] ||
			el.target === $(".anbarAddToTreeForm")[0] ||
			$.inArray(el.target, $(".anbarAddToTreeForm").children()) !== -1 ||
			$.inArray($(el.target).parent()[0], $(".anbarAddToTreeForm").children()) !== -1 ||
			$.inArray(
				$(el.target).parent().parent()[0],
				$(".anbarAddToTreeForm").children()
			) !== -1 ||
			$.inArray(
				$(el.target).parent().parent().parent()[0],
				$(".anbarAddToTreeForm").children()
			) !== -1 ||
			$.inArray(
				$(el.target).parent().parent().parent().parent()[0],
				$(".anbarAddToTreeForm").children()
			) !== -1 ||
			$.inArray(
				$(el.target).parent().parent().parent().parent().parent()[0],
				$(".anbarAddToTreeForm").children()
			) !== -1
		) {
			return;
		} else {
			// console.log("Closing");
			// console.log(el.target);
			// console.log($("#warehouseTreeInsertDeleteCluster"));
			// console.log($.inArray(el.target, $("#warehouseTreeInsertDeleteCluster")) !== -1);
			hideAddNewProductToTreeForm();
			return;
		}
	}

	if ($(".addNewSessionInfoForm").attr("data-isActive") === "True") {
		if ($.inArray(el.target, $("#optionsMenu img")) !== -1) {
			return;
		}
		if ($(".anbarAddToTreeForm").attr("data-isActive") === "true") {
			if (
				el.target === $("#addNewSessionInfoDropDownAddNewproductToTreeBtn")[0] ||
				el.target === $(".anbarAddToTreeForm")[0] ||
				$.inArray(el.target, $(".anbarAddToTreeForm").children()) !== -1 ||
				$.inArray($(el.target).parent()[0], $(".anbarAddToTreeForm").children()) !== -1
			) {
				return;
			} else {
				hideAddNewProductToTreeForm();
				return;
			}
		}
		if (
			$(el.target).attr("class") !== "addNewSessionInfoForm" &&
			$.inArray(el.target, $(".addNewSessionInfoForm").children()) < 0 &&
			$.inArray($(el.target).parent()[0], $(".addNewSessionInfoForm").children()) < 0 &&
			$.inArray(
				$(el.target).parent().parent()[0],
				$(".addNewSessionInfoForm").children()
			) < 0 &&
			$.inArray(
				$(el.target).parent().parent().parent()[0],
				$(".addNewSessionInfoForm").children()
			) < 0 &&
			$.inArray(
				$(el.target).parent().parent().parent().parent()[0],
				$(".addNewSessionInfoForm").children()
			) < 0 &&
			$.inArray(
				$(el.target).parent().parent().parent().parent().parent()[0],
				$(".addNewSessionInfoForm").children()
			) < 0 &&
			$.inArray(
				$(el.target).parent().parent().parent().parent().parent().parent()[0],
				$(".addNewSessionInfoForm").children()
			) < 0
		) {
			hideAddNewSessionInfoForm();
		}
	}
});

// Search product in addNewSessionInfo
function fillAddNewSessionInfoProductDropdown(data) {
	$("#addNewSessionInfoDrowdown").empty();
	let parent = $("#addNewSessionInfoDrowdown");
	data.forEach((el) => {
		if (el.product_id !== null) {
			parent.append(
				`<p class="dropdown-member" data-barcode="${el.barcode}" data-id="${el.product_id}">${el.title}</p>`
			);
		}
	});

	$(".dropdown-member").click(function () {
		$("#addNewSessionInfo_productId").attr("data-productId", $(this).attr("data-id"));
		$("#addNewSessionInfo_productId").val($(this).html());
		$("#addNewSessionInfo_barcode").val();
		setTimeout(() => {
			$("#addNewSessionInfoDrowdown").empty();
		}, 100);
	});
}
$("#addNewSessionInfo_productId").keyup(function () {
	if ($(this).val().trim() === "") return;
	let text = $(this).val().trim();
	let textNum = parseInt(text);
	if (!Number.isNaN(textNum)) {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", textNum)
				.execute("anbar.bulk_buying_session_info_search", (err, res) => {
					fillAddNewSessionInfoProductDropdown(res.recordset);
				});
		});
	} else {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("title", text)
				.execute("anbar.bulk_buying_session_info_search", (err, res) => {
					fillAddNewSessionInfoProductDropdown(res.recordset);
				});
		});
	}
});

// Search product in addNewSessionInfo with barcode
function fillAddNewSessionInfoProductBarcodeDropdown(data) {
	$("#addNewSessionInfoBarcodeDrowdown").empty();
	let parent = $("#addNewSessionInfoBarcodeDrowdown");
	data.forEach((el) => {
		if (el.product_id !== null) {
			parent.append(
				`<p class="dropdown-member" data-barcode="${el.barcode}" data-id="${el.product_id}">${el.title}</p>`
			);
		}
	});

	$(".dropdown-member").click(function () {
		$("#addNewSessionInfo_productId").attr("data-productId", $(this).attr("data-id"));
		$("#addNewSessionInfo_productId").val($(this).html());
		setTimeout(() => {
			$("#addNewSessionInfoDrowdown").empty();
		}, 100);
	});
}
$("#addNewSessionInfo_barcode").keyup(function () {
	if ($(this).val().trim() === "") return;
	let text = $(this).val().trim();
	let textNum = parseInt(text);
	poolConnect.then((pool) => {
		pool
			.request()
			.input("barcode", textNum)
			.execute("anbar.bulk_buying_session_info_search", (err, res) => {
				fillAddNewSessionInfoProductBarcodeDropdown(res.recordset);
			});
	});
});

// ADD NEW PRODUCT TO TREE PART
function warehouseTreeInsertAddNewCluster(pivot = undefined) {
	let clusterEl = $(`<div class="clusterTemplateElement"></div>`);
	let defaultCheck = '<p>Default:</p><input type="radio" name="default_cluster" />';
	let inputs = `<input type="text" placeholder="Cluster's name" />
	<input type="number" min="0" placeholder="Capacity" />`;
	let addNew = $(`<img src="../stylesGlobal/imgs/new_btn.svg" />`);
	let remove = $(`<img src="../stylesGlobal/imgs/delete_btn.svg" />`);

	if (pivot !== undefined) {
		pivot.after(clusterEl);
	} else {
		$(".newClusterTemplateContainer").append(clusterEl);
	}
	clusterEl.append(defaultCheck);
	clusterEl.append(inputs);
	clusterEl.append(addNew);
	clusterEl.append(remove);
	addNew.click((el) => {
		warehouseTreeInsertAddNewCluster($(el.target).parent());
	});
	remove.click((el) => {
		let counterActiveClusterTemplate = 0;
		$(".newClusterTemplateContainer")
			.children()
			.each(function () {
				if ($(this).attr("data-Active") !== "false") {
					counterActiveClusterTemplate++;
				}
			});
		if (counterActiveClusterTemplate < 2) {
			return;
		}

		$(el.target).parent().css("opacity", "0");
		$(el.target).parent().attr("data-Active", "false");
		setTimeout(() => {
			$(el.target).parent().css("display", "none");
		}, 400);
	});
}
function warehouseTreeInsertFormValidation() {
	if (
		$("#warehouseTreeInsert_title").val() === "" ||
		$("#warehouseTreeInsert_barcode").val() === "" ||
		$("#warehouseTreeInsert_categoryId").val() === ""
	) {
		return false;
	}

	let clusterArr = Array.from($(".newClusterTemplateContainer .clusterTemplateElement"));
	if (clusterArr.length < 2) return false;

	let tmp = 0;
	clusterArr.forEach((cluster) => {
		if ($(cluster).children()[1].checked) tmp += 1;
		if ($($(cluster).children()[2]).val() === "") return false;
		if ($($(cluster).children()[3]).val() === "") return false;
	});

	if (tmp !== 1) return false;

	return true;
}

// Search category in addNewProductToTree
function fillAddNewCategotyDropdown(data) {
	$("#warehouseCategoryDropdown").empty();
	let parent = $("#warehouseCategoryDropdown");
	data.forEach((el) => {
		parent.append(
			`<p class="dropdown-member" data-barcode="${el.barcode}" data-parentId="${el.parent_id}">${el.title}</p>`
		);
	});

	$(".dropdown-member").click(function () {
		$("#warehouseTreeInsert_categoryId").attr(
			"data-parentId",
			$(this).attr("data-parentId")
		);
		$("#warehouseTreeInsert_categoryId").val($(this).html());
		setTimeout(() => {
			$("#warehouseCategoryDropdown").empty();
		}, 100);
	});
}
$("#warehouseTreeInsert_categoryId").keyup(function () {
	if ($(this).val().trim() === "") return;
	let text = $(this).val().trim();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.warehouse_tree_search", (err, res) => {
				if (err !== null) console.log(err);
				let tmp = res.recordset.filter((el) => {
					return el.product_id === null;
				});
				fillAddNewCategotyDropdown(tmp);
			});
	});
});

function showAddNewProductToTreeForm() {
	$(".newClusterTemplateContainer").empty();

	warehouseTreeInsertAddNewCluster();

	$("#warehouseTreeInsert_title").val("");
	$("#warehouseTreeInsert_barcode").val("");
	$("#warehouseTreeInsert_categoryId").val("");

	let now = new Date();
	let day = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 2)).slice(-2);
	let date = now.getFullYear() + "-" + month + "-" + day;
	$("#warehouseTreeInsert_expDateWarning").val(date);

	$(".anbarAddToTreeForm").attr("data-isActive", "true");
	let arr = $(".anbarAdd-container").children();
	for (let i = 0; i < arr.length; i++) {
		if ($(arr[i]).attr("class") === "anbarAddToTreeForm") continue;
		$(arr[i]).css({
			filter: "brightness(40%)",
			"pointer-events": "none",
		});
	}
}
function hideAddNewProductToTreeForm() {
	$(".anbarAddToTreeForm").attr("data-isActive", "false");

	let arr = $(".anbarAdd-container").children();
	for (let i = 0; i < arr.length; i++) {
		if ($(arr[i]).attr("class") === "anbarAddToTreeForm") continue;
		$(arr[i]).css({
			filter: "brightness(100%)",
			"pointer-events": "all",
		});
	}
}
function addNewProductToTree(cluster_id, cluster_default) {
	if (!warehouseTreeInsertFormValidation()) return false;
	poolConnect.then((pool) => {
		pool
			.request()
			.input("parent_id", $("#warehouseTreeInsert_categoryId").attr("data-parentId"))
			.input("title", $("#warehouseTreeInsert_title"))
			.input("product_id", Math.random() * 1000000)
			.input("cluster", cluster_id)
			.input("cluster_default", cluster_default)
			.input("user_id", USER.id)
			.input(
				"exp_date_warning",
				moment($("#warehouseTreeInsert_expDateWarning").val()).format(
					"yyyy-MM-DD HH:mm:ss"
				)
			)
			.input("barcode", $("#warehouseTreeInsert_barcode").val())
			.execute("anbar.warehouse_tree_insert", (err, res) => {
				if (err !== null) console.log(err);
			});
	});
}
$("#warehouseTreeInsertSubmitBtn").click(() => {
	if (!warehouseTreeInsertFormValidation()) return;

	let cluster_id = new Date();
	console.log(BigInt(cluster_id));
	let cluster_default = undefined;

	let clusterArr = Array.from($(".newClusterTemplateContainer .clusterTemplateElement"));
	clusterArr.forEach((cluster, index) => {
		if ($(cluster).children()[1].checked) cluster_default = index;

		poolConnect.then((pool) => {
			pool
				.request()
				.input("cluster_id", BigInt(cluster_id))
				.input("capacity", $($(cluster).children()[3]).val())
				.input("cluster_order", index + 1)
				.input("title", $($(cluster).children()[2]).val())
				.input("user_id", USER.id)
				.execute("anbar.cluster_insert", (err) => {
					if (err !== null) console.log(err);
				});
		});
	});

	if (addNewProductToTree(cluster_id, cluster_default + 1)) {
		setTimeout(() => {
			hideAddNewProductToTreeForm();
		}, 400);
	}
});
$("#warehouseTreeInsertDiscardBtn").click(() => {
	hideAddNewProductToTreeForm();
});
$("#addNewSessionInfoDropDownAddNewproductToTreeBtn").click(function () {
	showAddNewProductToTreeForm();
});
$("#addNewSessionInfoDropDownAddNewproductToTreeBarcodeBtn").click(function () {
	showAddNewProductToTreeForm();
});

// ====================================================================================================
//                                        GENERAL DATE PICKER SETUP
// ====================================================================================================
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
	var month = ("0" + (now.getMonth() - 1)).slice(-2);
	var today = now.getFullYear() + "-" + month + "-" + day;
	var month2 = ("0" + (now.getMonth() + 1)).slice(-2);
	var today2 = now.getFullYear() + "-" + month2 + "-" + day;
	$("#date_from").val(today);
	$("#date_to").val(today2);
	getAllBulks(
		moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
		moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
	);

	setInterval(() => {
		console.log("Refreshed");
		getAllBulks(
			moment($("#date_from").val()).format("yyyy-MM-DD HH:mm:ss"),
			moment($("#date_to").val()).format("yyyy-MM-DD HH:mm:ss")
		);
	}, 60000);
})();
