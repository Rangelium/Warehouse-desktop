var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function (event) {
	currentMousePos.x = parseInt(event.pageX);
	currentMousePos.y = parseInt(event.pageY);
});

async function showAlert(message) {
	$("#alertMessage").html(message);
	$(".cstmAlertBox").css({
		display: "flex",
		opacity: "1",
		width: "30%",
		height: "30%",
		"z-index": 10000000000,
	});
	$(".blur").css("z-index", 1000000000);
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
		"z-index": -1000,
	});
	$(".blur").css("z-index", -1000);
	$(".anbarAdd-container").css({
		filter: "brightness(100%)",
		"pointer-events": "all",
	});
	setTimeout(() => {
		$(".cstmAlertBox").css("display", "none");
	}, 600);
}

// =====================================================================================
//                                Anbar Overall Info part
// =====================================================================================

// Function to show Overall info
function showOverallInfo() {
	try {
		new Promise((resolve) => {
			poolConnect.then((pool) => {
				pool.request().execute("anbar.dashboard", (err, res) => {
					if (err != null) console.log(err);
					if (res.recordset.length !== 0) {
						resolve(res.recordset[0]);
					} else {
						console.log("Anbar is empty!");
					}
				});
			});
		}).then((data) => {
			$("#products_quantity").html(data.quantity);
			$("#products_remaining").html(data.remaining_products);
			$("#anbar_total_cost").html(data.cost);

			$("#add_product_name").html(data.last_in_name);
			$("#add_product_date").html(
				moment(data.last_in_date).format("MMMM Do YYYY, h:mm:ss")
			);
			$("#add_product_price").html(data.last_in_price);
			$("#add_product_quantity").html(data.last_in_quantity);
			$("#add_product_total_price").html(data.last_in_price_total);
			$("#add_product_currency").html(data.last_in_currency);

			$("#rm_product_name").html(data.last_out_name);
			$("#rm_product_date").html(
				moment(data.last_out_date).format("MMMM Do YYYY, h:mm:ss")
			);
			$("#rm_product_price").html(data.last_out_price);
			$("#rm_product_quantity").html(data.last_out_quantity);
			$("#rm_product_total_price").html(data.last_out_price_total);
			$("#rm_product_currency").html(data.last_out_currency);

			// Show box after loading content
			$("#showOverallInfo").attr("data-isClicked", "true");
			$(".overall-info").attr("data-isShoving", "true");
		});
	} catch (error) {
		console.log(error);
	}
}
// Function to hide Overall info
function hideOverallInfo() {
	$("#showOverallInfo").attr("data-isClicked", "false");
	$(".overall-info").attr("data-isShoving", "false");
}
// Handle onclick showOverallInfo
$("#showOverallInfo").click(function () {
	if ($(this).attr("data-isClicked") == "true") {
		hideOverallInfo();
	} else {
		showOverallInfo();
	}
});

// =====================================================================================
//                                   TreeView part
// =====================================================================================

// Function to feel Tree
function feelTree(data) {
	treeView = new MyTreeView(data);
	treeView.showTree("treeViewContainer");

	// Set const width to tree width not change while closing dropdown
	$(".treeViewContainer").css("width", $(".treeViewContainer").width());

	// Handling clicks
	$(".tv-groupname").click(function () {
		let ul = $($(this).parent().parent().children()[1]);
		let span = $($(this).parent().parent().children()[0]);
		if (
			ul.attr("data-isExpanded") === "true" &&
			span.attr("data-isExpanded") === "true"
		) {
			ul.attr("data-isExpanded", "false");
			span.attr("data-isExpanded", "false");
		} else {
			ul.attr("data-isExpanded", "true");
			span.attr("data-isExpanded", "true");
		}
	});

	$(".tv-name").click(function () {
		$(".tv-name").attr("data-isSelected", "false");
		$(this).attr("data-isSelected", "true");

		showProductInfo(treeView.giveDataOfElement($(this)));
	});

	$(".tv-groupname").contextmenu(function () {
		showCategoryOptions($(this), treeView.giveDataOfElement($(this).parent()));
	});
	$(".tv-name").contextmenu(function () {
		showProductOptions($(this), treeView.giveDataOfElement($(this)));
	});
}

$("#expandTreeView").click(function () {
	$(this).attr("data-isClicked", "true");
	setTimeout(function () {
		$("#expandTreeView").attr("data-isClicked", "false");
	}, 600);

	let arr = $(".treeView  span");
	let arr2 = $(".treeView  ul");
	for (let i = 0; i < arr.length; i++) {
		$(arr[i]).attr("data-isexpanded", "true");
		$(arr2[i]).attr("data-isexpanded", "true");
	}
});
$("#closeTreeView").click(function () {
	$(this).attr("data-isClicked", "true");
	setTimeout(function () {
		$("#closeTreeView").attr("data-isClicked", "false");
	}, 600);

	let arr = $(".treeView  span");
	let arr2 = $(".treeView  ul");
	for (let i = 1; i < arr.length; i++) {
		$(arr[i]).attr("data-isexpanded", "false");
		$(arr2[i]).attr("data-isexpanded", "false");
	}
});

// Handle onclick hideShowTreeView
$("#hideShowTreeView").click(function () {
	if ($(this).attr("data-isClicked") == "true") {
		$(this).attr("data-isClicked", "false");
		$(".treeViewContainer").css("display", "block");
	} else {
		$(this).attr("data-isClicked", "true");
		$(".treeViewContainer").css("display", "none");
	}
});

// =====================================================================================
//                             RIGHT CLICK ON CATEGORY TREEVIEW
// =====================================================================================
function showCategoryOptions(element, data) {
	hideProductOptions();
	$(".categoryOptionsMenuMenber").attr("data-id", data.id);
	$(".categoryOptionsMenuMenber").attr("data-name", data.title);

	if (currentMousePos.y < $(document).height() * 0.8) {
		$("#categoryOptionsMenu").css({
			top: currentMousePos.y - 60,
			left: currentMousePos.x,
			opacity: 1,
			"pointer-events": "all",
		});
	} else {
		$("#categoryOptionsMenu").css({
			top: currentMousePos.y - $("#categoryOptionsMenu").width() - 60,
			left: currentMousePos.x,
			opacity: 1,
			"pointer-events": "all",
		});
	}
}
function hideCategoryOptions() {
	$("#categoryOptionsMenu").css({
		opacity: 0,
		"pointer-events": "none",
	});
}
$(document).click((el) => {
	if ($(el.target).attr("class") !== "categoryOptionsMenuMenber") {
		hideCategoryOptions();
	}
});

// Create new
$("#discardCreateCategoryBtn").click(() => {
	hideCreateCategory();
});
$("#createCategoryBtn").click(function () {
	if ($("#createNewCategoryName").val().trim() === "") return;

	poolConnect.then((pool) => {
		pool
			.request()
			.input("parent_id", $(this).attr("data-parentId"))
			.input("title", $("#createNewCategoryName").val())
			.input("product_id", null)
			.input("user_id", USER.id)
			.execute("anbar.warehouse_tree_insert", (err) => {
				if (err !== null) console.log(err);
				hideCreateCategory();
				fillTreeView();
			});
	});
});
function hideCreateCategory() {
	$(".blur").css("z-index", -1000);
	$(".createCategoryContainer").css({
		opacity: 0,
		"pointer-events": "none",
		"z-index": 1,
	});
}
function showCreateCategory(parentId) {
	$("#createCategoryBtn").attr("data-parentId", parentId);

	$(".blur").css("z-index", 1000000000);
	$(".createCategoryContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
$("#createCategory").click(function () {
	showCreateCategory($(this).attr("data-id"));
});

// Change Name
$("#discardChangeCategoryBtn").click(() => {
	hideEditCategory();
});
$("#changeCategoryTitleBtn").click(function () {
	if (
		$("#newCategoryName").val().trim() === "" ||
		$("#newCategoryName").val() === $(this).attr("data-title")
	)
		return;

	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", $(this).attr("data-id"))
			.input("title", $("#newCategoryName").val())
			.input("user_id", USER.id)
			.execute("anbar.warehouse_tree_update_title", (err) => {
				if (err !== null) console.log(err);
				hideEditCategory();
				fillTreeView();
			});
	});
});
function hideEditCategory() {
	$(".blur").css("z-index", -1000);
	$(".editCategoryContainer").css({
		opacity: 0,
		"pointer-events": "none",
		"z-index": 1,
	});
}
function showEditCategory(id, title) {
	$("#changeCategoryTitleBtn").attr("data-id", id);
	$("#changeCategoryTitleBtn").attr("data-title", title);
	$("#newCategoryName").val(title);

	$(".blur").css("z-index", 1000000000);
	$(".editCategoryContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
$("#editCategory").click(function () {
	showEditCategory($(this).attr("data-id"), $(this).attr("data-name"));
});

// Delete
$("#deleteCategory").click(function () {
	showAlert(`Are you sure you want delete "${$(this).attr("data-name")}"`).then((res) => {
		if (res) {
			poolConnect.then((pool) => {
				pool
					.request()
					.input("id", parseInt($(this).attr("data-id")))
					.input("user_id", USER.id)
					.execute("anbar.warehouse_tree_delete", (err, res) => {
						if (err !== null) console.log(err);
						fillTreeView();
					});
			});
		}
		closeAlert();
	});
});

// =====================================================================================
//                             RIGHT CLICK ON PRODUCT TREEVIEW
// =====================================================================================

function showProductOptions(element, data) {
	hideCategoryOptions();
	$(".productOptionsMenuMenber").attr("data-id", data.id);
	$(".productOptionsMenuMenber").attr("data-productId", data.product_id);
	$(".productOptionsMenuMenber").attr("data-name", data.title);

	if (currentMousePos.y < $(document).height() * 0.8) {
		$("#productOptionsMenu").css({
			top: currentMousePos.y - 60,
			left: currentMousePos.x,
			opacity: 1,
			"pointer-events": "all",
		});
	} else {
		$("#productOptionsMenu").css({
			top: currentMousePos.y - $("#productOptionsMenu").width() - 60,
			left: currentMousePos.x,
			opacity: 1,
			"pointer-events": "all",
		});
	}
}
function hideProductOptions() {
	$("#productOptionsMenu").css({
		opacity: 0,
		"pointer-events": "none",
	});
}
$(document).click((el) => {
	if ($(el.target).attr("class") !== "productOptionsMenuMenber") {
		hideProductOptions();
	}
});

// Create new
$("#discardCreateProductBtn").click(() => {
	hideCreateProduct();
});
$("#createProductBtn").click(function () {
	return;
	if ($("#createNewCategoryName").val().trim() === "") return;

	poolConnect.then((pool) => {
		pool
			.request()
			.input("user_id", USER.id)
			.execute("anbar.warehouse_tree_insert", (err) => {
				if (err !== null) console.log(err);
				hideCreateProduct();
				fillTreeView();
			});
	});
});
function hideCreateProduct() {
	$(".blur").css("z-index", -1000);
	$(".createProductContainer").css({
		opacity: 0,
		"pointer-events": "none",
		"z-index": 1,
	});
}
function showCreateProduct(parentId) {
	$("#createProductBtn").attr("data-parentId", parentId);

	$(".blur").css("z-index", 1000000000);
	$(".createProductContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
$("#createProduct").click(function () {
	showCreateProduct($(this).attr("data-id"));
});

// Change product
$("#discardEditProductBtn").click(() => {
	hideEditProduct();
});
$("#editProductBtn").click(function () {
	return;
	if (
		$("#newCategoryName").val().trim() === "" ||
		$("#newCategoryName").val() === $(this).attr("data-title")
	)
		return;

	poolConnect.then((pool) => {
		pool
			.request()
			.input("user_id", USER.id)
			.execute("anbar.warehouse_tree_update_title", (err) => {
				if (err !== null) console.log(err);
				hideEditCategory();
				fillTreeView();
			});
	});
});
function hideEditProduct() {
	$(".blur").css("z-index", -1000);
	$(".editProductContainer").css({
		opacity: 0,
		"pointer-events": "none",
		"z-index": 1,
	});
}
function showEditProduct(id, title) {
	$("#editProductBtn").attr("data-id", id);
	$("#editProductBtn").attr("data-title", title);

	$(".blur").css("z-index", 1000000000);
	$(".editProductContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
$("#editProduct").click(function () {
	showEditProduct($(this).attr("data-id"), $(this).attr("data-name"));
});

// Delete
$("#deleteProduct").click(function () {
	showAlert(`Are you sure you want delete "${$(this).attr("data-name")}"`).then((res) => {
		if (res) {
			poolConnect.then((pool) => {
				pool
					.request()
					.input("id", parseInt($(this).attr("data-id")))
					.input("user_id", USER.id)
					.execute("anbar.warehouse_tree_delete", (err, res) => {
						if (err !== null) console.log(err);
						fillTreeView();
					});
			});
		}
		closeAlert();
	});
});

// =====================================================================================
//                                   Search box part
// =====================================================================================

// Search box part
$("#clearSearchBox").click(() => {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.warehouse_tree_select", (err, res) => {
			$("#searchInputBox").val("");
			feelTree(res.recordset);
		});
	});
});
$("#searchInputBox").keyup(function () {
	if ($(this).val().trim() === "") return;
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", mssql.NVarChar(250), $(this).val())
			.execute("anbar.warehouse_tree_search", (err, res) => {
				feelTree(res.recordset);
			});
	});
});
$("#searchInputBox").focusout(function () {
	if ($(this).val().trim() === "") $(this).val("");
	if ($(this).val() === "") {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.warehouse_tree_select", (err, res) => {
				feelTree(res.recordset);
			});
		});
	}
});

// =====================================================================================
//                                SingleProductInfo part
// =====================================================================================

function fillSingleProductTable(data) {
	$(".singleProductTable").remove();

	$(".table-data").append("<table class='singleProductTable'></table>");
	$(".singleProductTable").append("<thead></thead>");
	$(".singleProductTable").append("<tbody></tbody>");

	$(".singleProductTable > thead").append(`<th>${languages["product_name"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["quantity"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["unit"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["unit_price"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["total_price"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["currency"]}:</th>`);
	// $(".singleProductTable > thead").append(`<th>Original price:</th>`);
	// $(".singleProductTable > thead").append(`<th>Original currency:</th>`);
	// $(".singleProductTable > thead").append(`<th>Current date:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["exp_date"]}</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["action"]}</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["confirmed"]}:</th>`);
	$(".singleProductTable > thead").append(`<th>${languages["product_cell"]}:</th>`);

	data.forEach((el) => {
		let row = "<tr>";

		row += `<td>${el.title}</td>`;
		row += `<td>${el.quantity}</td>`;
		row += `<td>${el.unit_title}</td>`;
		row += `<td>${el.unit_price}</td>`;
		row += `<td>${el.total_price}</td>`;
		row += `<td>${el.currency}</td>`;
		// row += `<td>${el.original_price}</td>`;
		// row += `<td>${el.original_currency}</td>`;
		row += `<td title="${moment(el.exp_date).format("Da MMMM YYYY, h:mm:ss")}">${moment(
			el.exp_date
		).format("Da MMMM YYYY")}</td>`;
		row += `<td>${el.is_out ? "Removed" : "Added"}</td>`;
		row += `<td>${el.performed_by}</td>`;
		row += `<td>${el.product_cell}</td>`;

		row += "</tr>";
		$(".singleProductTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 5) {
		for (let i = 0; i < 10 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 10; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".singleProductTable > tbody").append(row);
		}
	}
}

async function showProductInfo(productData) {
	// Check if already opened
	if ($("#singleProductId").html() == productData.product_id) {
		$("#singleProductId").html("");
		$(".singleProductInfo").css("opacity", "0");
		$(".singleProductInfo").css("pointer-events", "unset");

		let tmp = $(".treeView .tv-name");
		for (let i = 0; i < tmp.length; i++) {
			$(tmp[i]).attr("data-isselected", "false");
		}
		return;
	}

	let product_info = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", parseInt(productData.product_id))
				.execute("anbar.main_tree_click_info", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset[0]);
				});
		});
	});

	$("#singleProductName").html(productData.title);
	$("#singleProductId").html(productData.product_id);
	try {
		$("#singleProductPrice").html(product_info.price);
		$("#singleProductCurrency").html(product_info.currency);
		$("#singleProductCell").html(product_info.product_cell);
		$("#singleProductExpDate").html(
			moment(product_info.exp_date).format("DD-MM-yyyy HH:mm:ss")
		);
		$("#singleProductInQuantity").html(product_info.in_quantity);
		$("#singleProductLeft").html(product_info.left);
		$("#singleProductOutQuantity").html(product_info.out_quantity);
	} catch (err) {
		$("#singleProductPrice").html("null");
		$("#singleProductCurrency").html("null");
		$("#singleProductCell").html("null");
		$("#singleProductExpDate").html("null");
		$("#singleProductInQuantity").html("null");
		$("#singleProductLeft").html("null");
		$("#singleProductOutQuantity").html("null");
	}

	let table_product = await new Promise((resolve, reject) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", parseInt(productData.product_id))
				.execute("anbar.main_tree_click_table", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset);
				});
		});
	});

	fillSingleProductTable(table_product);

	$(".singleProductInfo").css("opacity", "1");
	$(".singleProductInfo").css("pointer-events", "unset");
}

// =====================================================================================
//                                On start functions
// =====================================================================================

// Load treeView from start
function fillTreeView() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.warehouse_tree_select", (err, res) => {
			feelTree(res.recordset);
		});
	});
}
fillTreeView();

// Set const width
$(".smallNav").css("height", $(".searchContainer").height());
