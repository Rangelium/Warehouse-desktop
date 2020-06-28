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
		if($(this).attr("data-isSelected") === "true"){
			$(".tv-name").attr("data-isSelected", "false");
			$(this).attr("data-isSelected", "false");

			$(".productTableInfo").css({opacity: 0, "pointer-events": "none"})
			$(".removeProductForm").css({opacity: 0, "pointer-events": "none"})
			return;
		}
		$(".productTableInfo").css({opacity: 0, "pointer-events": "none"})
			$(".removeProductForm").css({opacity: 0, "pointer-events": "none"})
		$(".tv-name").attr("data-isSelected", "false");
		$(this).attr("data-isSelected", "true");

		showProductTableInfo(treeView.giveDataOfElement($(this)));
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
//                                   Search box part
// =====================================================================================

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

// =====================================================================================
//                                  Anbar Remove part
// =====================================================================================

var lastProdData;

function fillTable(data) {
	$(".singleProductTable").remove();

	$(".anbar-remove-table-data").append("<table class='singleProductTable'></table>");
	$(".singleProductTable").append("<thead></thead>");
	$(".singleProductTable").append("<tbody></tbody>");

	$(".singleProductTable > thead").append(`<th>Title:</th>`);
	$(".singleProductTable > thead").append(`<th>Quantity:</th>`);
	$(".singleProductTable > thead").append(`<th>Unit:</th>`);
	$(".singleProductTable > thead").append(`<th>Price:</th>`);
	$(".singleProductTable > thead").append(`<th>Currency:</th>`);
	$(".singleProductTable > thead").append(`<th>Original price:</th>`);
	$(".singleProductTable > thead").append(`<th>Original currency:</th>`);
	$(".singleProductTable > thead").append(`<th>Expiration date</th>`);
	$(".singleProductTable > thead").append(`<th>Status</th>`);
	$(".singleProductTable > thead").append(`<th>Performed by:</th>`);
	$(".singleProductTable > thead").append(`<th>Cell:</th>`);

	data.forEach((el) => {
		let row = "<tr class='anbarRemoveRow'>";

		row += `<td>${el.title}</td>`;
		row += `<td>${el.left}</td>`;
		row += `<td>${el.unit}</td>`;
		row += `<td>${el.price}</td>`;
		row += `<td>${el.currency}</td>`;
		row += `<td>${el.original_price}</td>`;
		row += `<td>${el.original_currency}</td>`;
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
	if (data.length < 10) {
		for (let i = 0; i < 14 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 11; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".singleProductTable > tbody").append(row);
		}
	}

	$(".anbarRemoveRow").dblclick(function (){
		console.log($(this))
		showRemoveProductForm($(this))
	})
}

function showRemoveProductForm(){
	$(".productTableInfo").css({opacity: 0, "pointer-events": "none"})

	// Here

	$(".removeProductForm").css({ opacity: 1, "pointer-events": "all" });
}

$("#returnToTableBtn").click(() => {
	showProductTableInfo(lastProdData);
	$(".removeProductForm").css({opacity: 0, "pointer-events": "none"})
})

async function showProductTableInfo(productData) {
	lastProdData = productData;
	$("#productTitle").html(productData.title)

	let tableData = await new Promise((resolve, reject) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", productData.product_id)
				.execute("dbo.main_tree_click_info", (err, res) => {
					resolve(res.recordset);
				});
		});
	});

	fillTable(tableData);
	$(".productTableInfo").css({ opacity: 1, "pointer-events": "all" });
}

// =====================================================================================
//                                  On start functions
// =====================================================================================

// Load treeView from start
poolConnect.then((pool) => {
	pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
		feelTree(res.recordset);
	});
});

// Set const width
$(".smallNav").css("height", $(".searchContainer").height());
