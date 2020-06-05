// Function to show Overall info
function showOverallInfo() {
	new Promise((resolve, reject) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.dashboard", (err, res) => {
				resolve(res.recordset[0]);
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
}

// Search box part
$("#clearSearchBox").click(() => {
	poolConnect.then((pool) => {
		pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
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
			.execute("dbo.warehouse_tree_search", (err, res) => {
				feelTree(res.recordset);
			});
	});
});
$("#searchInputBox").focusout(function () {
	if ($(this).val().trim() === "") $(this).val("");
	if ($(this).val() === "") {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
				feelTree(res.recordset);
			});
		});
	}
});

// Show product details
function showProductInfo(productData) {
	console.log(productData);
}

// Functions on start
// Load treeView from start
poolConnect.then((pool) => {
	pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
		feelTree(res.recordset);
	});
});

// Set const width
$(".smallNav").css("height", $(".searchContainer").height());
