// Load treeView from start
poolConnect.then((pool) => {
	pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
		feelTree(res.recordset);
	});
});

// Function to feel Tree
function feelTree(data) {
	treeView = new MyTreeView(data);
	treeView.showTree("treeViewContainer");

	// Set const width
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
