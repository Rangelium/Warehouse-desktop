// =====================================================================================
//                                   TreeView part
// =====================================================================================

// Function to feel Tree
var treeView;
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
		// Check is already opened
		if ($(this).attr("data-isSelected") === "true") {
			$(".tv-name").attr("data-isSelected", "false");
			$(this).attr("data-isSelected", "false");

			$(".anbarAddMainAddProduct").attr("isActive", "false");
			return;
		}

		$(".tv-name").attr("data-isSelected", "false");
		$(this).attr("data-isSelected", "true");

		showMainAddProductForm(treeView.giveDataOfElement($(this)));
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
//                                 Add product part
// =====================================================================================

$("#addNewProductBtn").click(function () {
	if ($(this).attr("data-isClicked") == "true") {
		$(this).attr("data-isClicked", "false");
		$(".anbarAddAddNewProduct").attr("isActive", "false");
	} else {
		$(".tv-name").attr("data-isSelected", "false");
		$(".anbarAddMainAddProduct").attr("isActive", "false");

		$(this).attr("data-isClicked", "true");
		$(".anbarAddAddNewProduct").attr("isActive", "true");
	}
});

// =====================================================================================
//                                 Change name part
// =====================================================================================

$("#changeNameBtn").click(function () {
	if ($(this).attr("data-isClicked") == "true") {
		closeChangeNameForm();
	} else {
		showChangeNameForm();
	}
});

function findSelectedItem() {
	let res = null;
	for (let i = 0; i < $(".tv-name").length; i++) {
		if ($($(".tv-name")[i]).attr("data-isSelected") == "true") {
			return $($(".tv-name")[i]);
		}
	}

	return res;
}

function closeChangeNameForm() {
	$("#changeNameBtn").attr("data-isClicked", "false");
	$(".anbarAddChangeName").attr("isActive", "false");
}

var selectedObjTreeView;
function showChangeNameForm() {
	let selectedObj = findSelectedItem();
	selectedObjTreeView = selectedObj;
	if (selectedObj === null) return;

	$("#changeNameBtn").attr("data-isClicked", "true");

	$(".anbarAddChangeName").css(
		"left",
		selectedObj.offset().left + selectedObj.outerWidth(true) + 10
	);
	$(".anbarAddChangeName").css(
		"top",
		selectedObj.offset().top - $(".anbarAddChangeName").outerHeight(true) / 2
	);

	$("#productPrevName").html(selectedObj.html());

	$(".anbarAddChangeName").attr("isActive", "true");
}

$("#submitChangeName").click(function () {
	if (
		$("#changeNameNewName").val() === $("#productPrevName").html() ||
		$("#changeNameNewName").val() === ""
	) {
		closeChangeNameForm();
		return;
	}

	let selectedObj = treeView.giveDataOfElement(selectedObjTreeView);

	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", selectedObj.id)
			.input("title", $("#changeNameNewName").val())
			.input("user_id", USER.id)
			.execute("dbo.warehouse_tree_update_title", (err, res) => {
				if (err !== null) console.log(err);
				closeChangeNameForm();

				pool.request().execute("dbo.warehouse_tree_select", (err, res) => {
					feelTree(res.recordset);
				});
			});
	});
});

// =====================================================================================
//                                  Main Add Product Part
// =====================================================================================

var productDataGlobal;
async function showMainAddProductForm(productData) {
	$("#addNewProductBtn").attr("data-isClicked", "false");
	$(".anbarAddAddNewProduct").attr("isActive", "false");

	productDataGlobal = productData;
	$("#productName").html(productData.title);

  var now = new Date();

  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  let today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $("#productCurrDate").val(today)
  $("#productCurrDate").attr("disabled", "")
  $("#productExpDate").val(today)

	let clusterData = await new Promise((resolve, reject) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.cluster_names_select_all", (err, res) => {
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < clusterData.length; i++) {
		$("#productCluster").append(
			`<option data-id="${clusterData[i].id}">${clusterData[i].title}</option>`
		);
	}

	let currencyData = await new Promise((resolve, reject) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.currency_select_full", (err, res) => {
				resolve(res.recordset);
			});
		});
	});
	for (let i = 0; i < currencyData.length; i++) {
		$("#productCurrency").append(
			`<option title="${currencyData[i].full_title}" data-id="${currencyData[i].id}">${currencyData[i].title}</option>`
		);
	}

	// Showing Form
	$(".anbarAddMainAddProduct").attr("isActive", "true");
}

$("#submitMainAddProduct").click(function () {
	if (
		$("#amountOfProduct").val() === "" ||
		$("#productPrice").val() === "" ||
		$("#productCell").val() === "" ||
		$("#productVOEN").val() === ""
	) {
		return;
  }
  
	poolConnect.then((pool) => {
		pool
			.request()
			.input("product_id", productDataGlobal.product_id)
			.input("quantity", $("#amountOfProduct").val())
			.input("is_out", 0)
			.input("price", $("#productPrice").val())
      .input("quantity_cluster", $("#productCluster").children("option:selected").attr("data-id"))
      .input("exp_date", moment($("#productExpDate").val()).format("yyyy-MM-DD HH:mm:ss"))
      .input("cur_date", moment($("#productCurrDate").val()).format("yyyy-MM-DD HH:mm:ss"))
      .input("reason", $("#productReason").val())
      .input("product_cell", $("#productCell").val())
      .input("document_id", $("#productVOEN").val())
      .input("currency", $("#productCurrency").children("option:selected").attr("data-id"))
      .input("user_id", USER.id)
      .input("product_seller", USER.id)
			.execute("dbo.main_insert", (err, res) => {
				if (err !== null) console.log(err);
				else console.log("Ok");
			});
  });
});

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
