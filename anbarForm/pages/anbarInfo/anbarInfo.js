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
	if ($("#trashBin").attr("data-isClicked") == "true") {
		hideTrashBin();
		setTimeout(() => {
			try {
				new Promise((resolve) => {
					poolConnect.then((pool) => {
						pool.request().execute("anbar.dashboard", (err, res) => {
							if (err != null) console.log(err);
							console.log(res);
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
		}, 400);
	} else {
		try {
			new Promise((resolve) => {
				poolConnect.then((pool) => {
					pool.request().execute("anbar.dashboard", (err, res) => {
						if (err != null) console.log(err);
						console.log(res);
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
//                                Anbar TRASHBIN part
// =====================================================================================

function showTrashBin() {
	if ($("#showOverallInfo").attr("data-isClicked") == "true") {
		hideOverallInfo();
		setTimeout(() => {
			$("#trashBin").attr("data-isClicked", "true");
			$(".trash-bin").attr("data-isShoving", "true");
		}, 400);
	} else {
		$("#trashBin").attr("data-isClicked", "true");
		$(".trash-bin").attr("data-isShoving", "true");
	}
}
function hideTrashBin() {
	$("#trashBin").attr("data-isClicked", "false");
	$(".trash-bin").attr("data-isShoving", "false");
}
$("#trashBin").click(function () {
	if ($(this).attr("data-isClicked") == "true") {
		hideTrashBin();
	} else {
		showTrashBin();
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
		$(".tv-groupname").attr("data-isSelected", "false");
		$(".tv-name").attr("data-isSelected", "false");
		$(this).attr("data-isSelected", "true");

		showProductInfo(treeView.giveDataOfElement($(this)));
	});
	// $(".tv-groupname").click(function () {
	// 	$(".tv-name").attr("data-isSelected", "false");
	// 	$(".tv-groupname").attr("data-isSelected", "false");
	// 	$(this).attr("data-isSelected", "true");

	// 	showCategoryInfo(treeView.giveDataOfElement($(this).parent()));
	// });

	$(".tv-groupname").contextmenu(function () {
		showCategoryOptions($(this), treeView.giveDataOfElement($(this).parent()));
	});
	$(".tv-name").contextmenu(function () {
		showProductOptions($(this), treeView.giveDataOfElement($(this)));
	});
}

$("#expandCloseTreeView").attr("data-treeExpanded", "true");
$("#expandCloseTreeView").click(function () {
	$(this).attr("data-isClicked", "true");
	setTimeout(() => {
		$(this).attr("data-isClicked", "false");
	}, 600);

	if ($(this).attr("data-treeExpanded") === "false") {
		$(this).attr("data-treeExpanded", "true");
		$(this).find("p").html("Ağac bağla");
		let arr = $(".treeView  span");
		let arr2 = $(".treeView  ul");
		for (let i = 0; i < arr.length; i++) {
			$(arr[i]).attr("data-isexpanded", "true");
			$(arr2[i]).attr("data-isexpanded", "true");
		}
	} else if ($(this).attr("data-treeExpanded") === "true") {
		$(this).attr("data-treeExpanded", "false");
		$(this).find("p").html("Ağac genişləndir");
		let arr = $(".treeView  span");
		let arr2 = $(".treeView  ul");
		for (let i = 1; i < arr.length; i++) {
			$(arr[i]).attr("data-isexpanded", "false");
			$(arr2[i]).attr("data-isexpanded", "false");
		}
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

	if (currentMousePos.y < $(document).height() * 0.5) {
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
	$("#createNewCategoryName").val("");
	showCreateCategory($(this).attr("data-id"));
	hideCategoryOptions();
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
	hideCategoryOptions();
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
	hideCategoryOptions();
});

// Create new product
function warehouseTreeInsertAddNewCluster(pivot = undefined) {
	let clusterEl = $(`<div class="clusterTemplateElement"></div>`);
	let defaultCheck =
		'<div class="item"><p>Default:</p><input type="radio" name="default_cluster" /></div>';
	let inputs = `<div class="warehouseClustersDrowdown">
									<input required type="text" class="warehouseNewClusterInput" placeholder="Cluster's name" />
								<div class="dropdown">
									<div id="warehouseClustersDropdown" class="containerDropdown"></div>
								</div>
								</div>
								<input required type="number" min="0" placeholder="Capacity" />`;
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
	$(".warehouseNewClusterInput").keyup(function () {
		clusterNewInputKeyUp.call(this);
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

	if (
		$("#warehouseTreeInsert_clusterTemplate").attr("data-clusterId") !== undefined &&
		$("#warehouseTreeInsert_clusterTemplate").val() !== ""
	) {
	} else {
		let clusterArr = Array.from(
			$(".newClusterTemplateContainer .clusterTemplateElement")
		);
		let tmp = 0;
		clusterArr.forEach((cluster) => {
			if ($($(cluster).children()[0]).children()[1].checked) tmp += 1;
			if ($($($(cluster).children()[1]).children()[0]).val() === "") return false;
			if ($($(cluster).children()[2]).val() === "") return false;
		});

		if (tmp !== 1) return false;
	}

	return true;
}
$("#discardCreateProductBtn").click(() => {
	hideCreateProduct();
});
async function createNewClusterName(name) {
	let res = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("title", name)
				.input("user_id", USER.id)
				.execute("anbar.cluster_names_insert", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset[0].id);
				});
		});
	});

	return res;
}
async function handleCreateClusters(cluster_id) {
	let cluster_default;
	let clusterArr = Array.from($(".newClusterTemplateContainer .clusterTemplateElement"));
	clusterArr.forEach(async (cluster, index) => {
		if ($(cluster).attr("data-active") !== "false") {
			if ($($(cluster).children()[0]).children()[1].checked) cluster_default = index;

			let title =
				$(cluster).attr("data-clusterId") === undefined
					? await createNewClusterName(
							$($($($(cluster).children()[1]).children()[0])).val()
					  )
					: parseInt($(cluster).attr("data-clusterId"));

			poolConnect.then((pool) => {
				pool
					.request()
					.input("cluster_id", BigInt(cluster_id))
					.input("capacity", $($(cluster).children()[2]).val())
					.input("cluster_order", index + 1)
					.input("title", title)
					.input("user_id", USER.id)
					.execute("anbar.cluster_insert", (err) => {
						if (err !== null) console.log(err);
					});
			});
		}
	});

	return cluster_default + 1;
}
$("#createProductBtn").click(async function () {
	console.log("started");
	if (!warehouseTreeInsertFormValidation()) return false;
	console.log("validation passed");

	let cluster_id;
	let cluster_default;
	let product_id = parseInt(new Date().getTime() / 1000);

	if (
		$("#warehouseTreeInsert_clusterTemplate").attr("data-clusterId") !== undefined &&
		$("#warehouseTreeInsert_clusterTemplate").val() !== ""
	) {
		cluster_id = parseInt(
			$("#warehouseTreeInsert_clusterTemplate").attr("data-clusterId")
		);
		cluster_default = parseInt(
			$("#warehouseTreeInsert_clusterTemplate").attr("data-clusterDef")
		);
	} else {
		cluster_id = parseInt(new Date().getTime() / 1000);
		cluster_default = await handleCreateClusters(cluster_id);
	}

	poolConnect.then((pool) => {
		pool
			.request()
			.input(
				"parent_id",
				parseInt($("#warehouseTreeInsert_categoryId").attr("data-parentId"))
			)
			.input("title", $("#warehouseTreeInsert_title").val())
			.input("product_id", BigInt(product_id))
			.input("cluster", BigInt(cluster_id))
			.input("cluster_default", cluster_default)
			.input("user_id", USER.id)
			.input("exp_date_warning", parseInt($("#warehouseTreeInsert_expDateWarning").val()))
			.input("barcode", BigInt($("#warehouseTreeInsert_barcode").val()))
			.input("min_quantity", parseFloat($("#warehouseTreeInsert_minQuantity").val()))
			.input("optimal_quantity", parseFloat($("#warehouseTreeInsert_optQuantity").val()))
			.input(
				"department_id",
				parseInt($("#warehouseTreeInsert_categoryId").attr("data-departmentid"))
			)
			.execute("anbar.warehouse_tree_insert", (err, res) => {
				if (err !== null) console.log(err);
				console.log("Added");
				setTimeout(() => {
					fillTreeView();
					hideCreateProduct();
				}, 400);
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
function showCreateProduct(parentId, catName) {
	$("#createProductBtn").attr("data-parentId", parentId);

	$(".newClusterTemplateContainer").empty();
	warehouseTreeInsertAddNewCluster();

	$("#warehouseTreeInsert_title").val("");
	$("#warehouseTreeInsert_barcode").val("");
	$("#warehouseTreeInsert_categoryId").val("");
	$("#warehouseTreeInsert_minQuantity").val("");
	$("#warehouseTreeInsert_optQuantity").val("");
	$("#warehouseTreeInsert_expDateWarning").val("");

	poolConnect.then((pool) => {
		pool.request().execute("anbar.warehouse_category_search", (err, res) => {
			if (err !== null) console.log(err);

			res.recordset.forEach((el) => {
				if (el.id === parseInt(parentId)) {
					$("#warehouseTreeInsert_categoryId").val(catName);
					$("#warehouseTreeInsert_categoryId").attr("data-parentId", parentId);
					$("#warehouseTreeInsert_categoryId").attr(
						"data-departmentId",
						el.department_id
					);
				}
			});
			fillAddNewCategotyDropdown(res.recordset);
		});
	});

	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", "")
			.execute("anbar.cluster_select_from_product", (err, res) => {
				if (err !== null) console.log(err);
				fillClusterDefault(res.recordset);
			});
	});

	// Showing form
	$(".blur").css("z-index", 1000000000);
	$(".createProductContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
$("#createProduct").click(function () {
	showCreateProduct($(this).attr("data-id"), $(this).attr("data-name"));
	hideCategoryOptions();
});
function fillAddNewCategotyDropdown(data) {
	$("#warehouseCategoryDropdown").empty();
	let parent = $("#warehouseCategoryDropdown");
	data.forEach((el) => {
		parent.append(
			`<p class="dropdown-member-category" data-id="${el.id}" data-departmentId="${el.department_id}">${el.title}</p>`
		);
	});

	$(".dropdown-member-category").click(function () {
		$("#warehouseTreeInsert_categoryId").attr("data-parentId", $(this).attr("data-id"));
		$("#warehouseTreeInsert_categoryId").attr(
			"data-departmentId",
			$(this).attr("data-departmentId")
		);
		$("#warehouseTreeInsert_categoryId").val($(this).html());
		setTimeout(() => {
			$("#warehouseCategoryDropdown").empty();
		}, 100);
	});
}
$("#warehouseTreeInsert_categoryId").keyup(function () {
	if ($(this).val().trim() === "") {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.warehouse_category_search", (err, res) => {
				if (err !== null) console.log(err);
				fillAddNewCategotyDropdown(res.recordset);
			});
		});

		return;
	}
	let text = $(this).val().trim();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.warehouse_category_search", (err, res) => {
				if (err !== null) console.log(err);
				fillAddNewCategotyDropdown(res.recordset);
			});
	});
});
function fillNewClusterTittles(mount, data) {
	$(mount).empty();
	let parent = $(mount);
	data.forEach((el) => {
		parent.append(
			`<p class="dropdown-member-cluster"  data-clusterId="${el.id}">${el.title}</p>`
		);
	});

	$(".dropdown-member-cluster").click(function () {
		let parent = $($(this).parent().parent().parent().parent());
		let input = $(
			$($($(this).parent().parent().parent().parent()).children()[1]).children()[0]
		);
		parent.attr("data-clusterId", $(this).attr("data-clusterId"));
		input.val($(this).html());
		setTimeout(() => {
			$("#warehouseCategoryDropdown").empty();
		}, 100);
	});
}
function clusterNewInputKeyUp() {
	let text = $(this).val().trim();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.cluster_names_search", (err, res) => {
				if (err !== null) console.log(err);

				fillNewClusterTittles($($(this).siblings().children()[0]), res.recordset);
			});
	});
}
function fillClusterDefault(data) {
	$("#warehouseClusterDefaultDropdown").empty();
	let parent = $("#warehouseClusterDefaultDropdown");
	data.forEach((el) => {
		parent.append(
			`<p class="dropdown-member-cluster-default" data-clusterDef="${el.cluster_default}"  data-clusterId="${el.cluster}">${el.title}</p>`
		);
	});

	$(".dropdown-member-cluster-default").click(function () {
		$("#warehouseTreeInsert_clusterTemplate").attr(
			"data-clusterDef",
			$(this).attr("data-clusterDef")
		);
		$("#warehouseTreeInsert_clusterTemplate").attr(
			"data-clusterId",
			$(this).attr("data-clusterId")
		);
		$("#warehouseTreeInsert_clusterTemplate").val($(this).html());
		setTimeout(() => {
			$("#warehouseClusterDefaultDropdown").empty();
		}, 100);
	});
}
setInterval(() => {
	if ($("#warehouseTreeInsert_clusterTemplate").val() !== "") {
		$(".newClusterTemplateContainer").css({
			opacity: 0.6,
			"pointer-events": "none",
		});
	} else {
		$(".newClusterTemplateContainer").css({
			opacity: 1,
			"pointer-events": "all",
		});
	}
}, 400);
$("#warehouseTreeInsert_clusterTemplate").keyup(function () {
	let text = $(this).val().trim();
	if (text !== "") {
		$(".newClusterTemplateContainer").css({
			opacity: 0.6,
			"pointer-events": "none",
		});
	} else {
		$(".newClusterTemplateContainer").css({
			opacity: 1,
			"pointer-events": "all",
		});
	}

	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.cluster_select_from_product", (err, res) => {
				if (err !== null) console.log(err);
				fillClusterDefault(res.recordset);
			});
	});
});

// Clear category
async function clearElements(data) {
	console.log("deleting");
	console.log(data);
	data.forEach((el) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("id", el.id)
				.input("user_id", USER.id)
				.execute("anbar.warehouse_tree_delete", (err, res) => {
					if (err !== null) console.log(err);
					fillTreeView();
				});
		});
	});
}
$("#clearCategory").click(async function () {
	let catId = parseInt($(this).attr("data-id"));

	let data = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.warehouse_tree_select", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset.filter((el) => el.parent_id === catId));
			});
		});
	});

	let names = [];
	data.forEach((el) => {
		names.push(`${el.title} `);
	});

	showAlert(`Are you sure you want to delete flowing elements: \n [${names}]`).then(
		async (res) => {
			if (res) {
				await clearElements(data);
			}
			closeAlert();
			fillTreeView();
		}
	);

	hideCategoryOptions();
});

// Show catregori info
$("#showCategoryInfo").click(function () {
	$(".tv-name").attr("data-isSelected", "false");
	$(".tv-groupname").attr("data-isSelected", "false");
	// $(this).attr("data-isSelected", "true");

	showCategoryInfo(treeView.giveDataOfElement($(this)));
	hideCategoryOptions();
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

// Change product data
var edit_selectedProductData;
var edit_selectedProductCatData;
var edit_selectedProductClusterData;
var edit_deletedClusterArr = [];
function edit_warehouseTreeInsertAddNewCluster(
	cluster,
	pivot = undefined,
	newOrder = undefined
) {
	let clusterOrder = cluster.cluster_order;

	if (!cluster.cluster_order) {
		clusterOrder = newOrder;
	}

	let clusterEl = $(
		`<div data-id="${
			cluster.id ? cluster.id : "none"
		}" data-clusterOrder="${clusterOrder}" class="edit_clusterTemplateElement"></div>`
	);
	let defaultCheck =
		'<div class="item"><p>Default:</p><input type="radio" class="edit_radio" name="edit_default_cluster" /></div>';
	let inputs = `<div class="edit_warehouseClustersDrowdown">
									<input required value="${
										cluster.title ? cluster.title : ""
									}" type="text" class="edit_warehouseNewClusterInput" placeholder="Cluster's name" />
								<div class="dropdown">
									<div id="edit_warehouseClustersDropdown" class="containerDropdown"></div>
								</div>
								</div>
								<input required value="${
									cluster.capacity ? cluster.capacity : ""
								}" type="number" min="0" placeholder="Capacity" />`;
	let addNew = $(`<img src="../stylesGlobal/imgs/new_btn.svg" />`);
	let remove = $(`<img src="../stylesGlobal/imgs/delete_btn.svg" />`);

	if (pivot !== undefined) {
		pivot.after(clusterEl);
	} else {
		$(".edit_newClusterTemplateContainer").append(clusterEl);
	}
	clusterEl.append(defaultCheck);
	clusterEl.append(inputs);
	clusterEl.append(addNew);
	clusterEl.append(remove);

	addNew.click((el) => {
		let currEl = $(el.target).parent();
		let nextEl = currEl.next();

		let currOrder = parseFloat($(el.target).parent().attr("data-clusterOrder"));
		let nextOrder = parseFloat(nextEl.attr("data-clusterOrder"));

		let tmpNewOrder = (currOrder + nextOrder) / 2;
		if (!nextOrder) {
			tmpNewOrder = currOrder + 1;
		}

		edit_warehouseTreeInsertAddNewCluster([], $(el.target).parent(), tmpNewOrder);
	});
	remove.click((el) => {
		let counterActiveClusterTemplate = 0;
		$(".edit_newClusterTemplateContainer")
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
		edit_deletedClusterArr.push(parseInt($(el.target).parent().attr("data-id")));
		setTimeout(() => {
			$(el.target).parent().detach();
			$(el.target).parent().css("display", "none");
		}, 400);
	});
	$(".edit_warehouseNewClusterInput").keyup(function () {
		edit_clusterNewInputKeyUp.call(this);
	});
}
function edit_fillNewClusterTittles(mount, data) {
	$(mount).empty();
	let parent = $(mount);
	data.forEach((el) => {
		parent.append(
			`<p class="edit_dropdown-member-cluster"  data-clusterId="${el.id}">${el.title}</p>`
		);
	});

	$(".edit_dropdown-member-cluster").click(function () {
		let parent = $($(this).parent().parent().parent().parent());
		let input = $(
			$($($(this).parent().parent().parent().parent()).children()[1]).children()[0]
		);
		parent.attr("data-clusterId", $(this).attr("data-clusterId"));
		input.val($(this).html());
		setTimeout(() => {
			$("#edit_warehouseCategoryDropdown").empty();
		}, 100);
	});
}
function edit_clusterNewInputKeyUp() {
	let text = $(this).val().trim();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.cluster_names_search", (err, res) => {
				if (err !== null) console.log(err);

				fillNewClusterTittles($($(this).siblings().children()[0]), res.recordset);
			});
	});
}
$("#discardEditProductBtn").click(() => {
	hideEditProduct();
});
function edit_warehouseTreeInsertFormValidation() {
	if (
		$("#edit_warehouseTreeInsert_title").val() === "" ||
		$("#edit_warehouseTreeInsert_categoryId").val() === ""
	) {
		return false;
	}

	if (
		$("#edit_warehouseTreeInsert_clusterTemplate").attr("data-clusterId") !== undefined &&
		$("#edit_warehouseTreeInsert_clusterTemplate").val() !== ""
	) {
	} else {
		let clusterArr = Array.from(
			$(".edit_newClusterTemplateContainer .edit_clusterTemplateElement")
		);
		let tmp = 0;
		clusterArr.forEach((cluster) => {
			if ($($(cluster).children()[0]).children()[1].checked) tmp += 1;
			if ($($($(cluster).children()[1]).children()[0]).val() === "") return false;
			if ($($(cluster).children()[2]).val() === "") return false;
		});

		if (tmp !== 1) return false;
	}

	return true;
}
async function edit_createNewClusterName(name) {
	let res = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("title", name)
				.input("user_id", USER.id)
				.execute("anbar.cluster_names_insert", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset[0].id);
				});
		});
	});

	return res;
}
async function handleEditCluster(cluster_id) {
	let clusterArr = Array.from(
		$(".edit_newClusterTemplateContainer .edit_clusterTemplateElement")
	);

	clusterArr.forEach(async (cluster, index) => {
		if ($(cluster).attr("data-active") !== "false") {
			index++;
			let clusterUniqueId = $(cluster).attr("data-id");
			let clusterOrder = $(cluster).attr("data-clusterOrder");
			let cluster_title = $($($(cluster).children()[1]).children()[0])
				.val()
				.trim();
			let cluster_capacity = $($(cluster).children()[2]).val().trim();

			if (clusterUniqueId !== "none") {
				let title = await new Promise((resolve) => {
					edit_selectedProductClusterData.find((el) => {
						if (el.title === cluster_title) {
							resolve(el.title_id);
						}
					});
					resolve(undefined);
				});

				if (!title) {
					title = $(cluster).attr("data-clusterId")
						? $(cluster).attr("data-clusterId")
						: await edit_createNewClusterName(cluster_title);
				}

				poolConnect.then((pool) => {
					pool
						.request()
						.input("id", clusterUniqueId)
						.input("title", title)
						.input("capacity", cluster_capacity)
						.input("user_id", USER.id)
						.execute("anbar.cluster_update", (err) => {
							if (err !== null) console.log(err);
						});
				});
			} else {
				let title =
					$(cluster).attr("data-clusterId") === undefined
						? await edit_createNewClusterName(cluster_title)
						: parseInt($(cluster).attr("data-clusterId"));

				poolConnect.then((pool) => {
					pool
						.request()
						.input("cluster_id", BigInt(cluster_id))
						.input("capacity", cluster_capacity)
						.input("cluster_order", clusterOrder)
						.input("title", title)
						.input("user_id", USER.id)
						.execute("anbar.cluster_insert", (err) => {
							if (err !== null) console.log(err);
						});
				});
			}
		}
	});
}
$("#editProductBtn").click(async function () {
	if (!edit_warehouseTreeInsertFormValidation()) return;

	let new_parent_id = $("#edit_warehouseTreeInsert_categoryId").attr("data-parentId");
	let department_id = $("#edit_warehouseTreeInsert_categoryId").attr("data-departmentId");
	let cluster_default;

	if (new_parent_id === undefined || department_id === undefined) {
		new_parent_id = edit_selectedProductCatData.id;
		department_id = edit_selectedProductCatData.department_id;
	}
	Array.from($(".edit_radio")).forEach((r, i) => {
		if ($(r)[0].checked) {
			cluster_default = i + 1;
		}
	});

	await handleEditCluster(edit_selectedProductData.cluster);

	edit_deletedClusterArr.forEach((id) => {
		if (id !== NaN) {
			poolConnect.then((pool) => {
				pool
					.request()
					.input("id", id)
					.execute("anbar.cluster_delete", (err) => {
						if (err !== null) console.log(err);
					});
			});
		}
	});

	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", edit_selectedProductData.id)
			.input("new_title", $("#edit_warehouseTreeInsert_title").val())
			.input("new_parent_id", parseInt(new_parent_id))
			.input("new_cluster", edit_selectedProductData.cluster)
			.input("exp_date_warning", $("#edit_warehouseTreeInsert_expDateWarning").val())
			.input("cluster_default", cluster_default)
			.input("user_id", USER.id)
			.input("barcode", $("#edit_warehouseTreeInsert_barcode").val())
			.input("min_quantity", $("#edit_warehouseTreeInsert_minQuantity").val())
			.input("optimal_quantity", $("#edit_warehouseTreeInsert_optQuantity").val())
			.input("department_id", parseInt(department_id))
			.execute("anbar.warehouse_tree_update", (err) => {
				if (err !== null) console.log(err);

				console.log("Edited");
				hideEditProduct();
			});
	});
});
function hideEditProduct() {
	fillTreeView();
	$(".blur").css("z-index", -1000);
	$(".editProductContainer").css({
		opacity: 0,
		"pointer-events": "none",
		"z-index": 1,
	});
}
async function showEditProduct(productId) {
	// $("#editProductBtn").attr("data-productId", productId);
	let productData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", BigInt(productId))
				.execute("anbar.warehouse_select_one_product", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset[0]);
				});
		});
	});
	let categoryData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.warehouse_category_search", (err, res) => {
				if (err !== null) console.log(err);
				res.recordset.forEach((el) => {
					if (el.id === productData.parent_id) resolve(el);
				});
				resolve(null);
			});
		});
	});
	let productClusterData = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("cluster_id", BigInt(productData.cluster))
				.execute("anbar.cluster_info_by_id", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset);
				});
		});
	});

	edit_selectedProductData = productData;
	edit_selectedProductCatData = categoryData;
	edit_selectedProductClusterData = productClusterData;

	$("#edit_warehouseTreeInsert_title").val(productData.title);
	$("#edit_warehouseTreeInsert_barcode").val(productData.barcode);
	$("#edit_warehouseTreeInsert_categoryId").val(categoryData.title);
	$("#edit_warehouseTreeInsert_minQuantity").val(productData.min_quantity);
	$("#edit_warehouseTreeInsert_optQuantity").val(productData.optimal_quantity);
	$("#edit_warehouseTreeInsert_expDateWarning").val(productData.exp_date_warning);
	$("#edit_warehouseTreeInsert_clusterTemplate").val("");
	$(".edit_newClusterTemplateContainer").empty();

	Array.from(productClusterData)
		.sort((el1, el2) => el1.cluster_order - el2.cluster_order)
		.forEach((cluster) => {
			edit_warehouseTreeInsertAddNewCluster(cluster);
		});

	Array.from($(".edit_radio")).forEach((r, i) => {
		if (i + 1 === productData.cluster_default) {
			$(r)[0].checked = true;
		}
	});

	poolConnect.then((pool) => {
		pool.request().execute("anbar.warehouse_category_search", (err, res) => {
			if (err !== null) console.log(err);
			edit_fillAddNewCategotyDropdown(res.recordset);
		});
	});
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", "")
			.execute("anbar.cluster_select_from_product", (err, res) => {
				if (err !== null) console.log(err);
				edit_fillClusterDefault(res.recordset);
			});
	});

	// Showing form
	$(".blur").css("z-index", 1000000000);
	$(".editProductContainer").css({
		opacity: 1,
		"pointer-events": "all",
		"z-index": 10000000000,
	});
}
function edit_fillAddNewCategotyDropdown(data) {
	$("#edit_warehouseCategoryDropdown").empty();
	let parent = $("#edit_warehouseCategoryDropdown");
	data.forEach((el) => {
		parent.append(
			`<p class="edit_dropdown-member-category" data-id="${el.id}" data-departmentId="${el.department_id}">${el.title}</p>`
		);
	});

	$(".edit_dropdown-member-category").click(function () {
		$("#edit_warehouseTreeInsert_categoryId").attr(
			"data-parentId",
			$(this).attr("data-id")
		);
		$("#edit_warehouseTreeInsert_categoryId").attr(
			"data-departmentId",
			$(this).attr("data-departmentId")
		);
		$("#edit_warehouseTreeInsert_categoryId").val($(this).html());
		setTimeout(() => {
			$("#edit_warehouseCategoryDropdown").empty();
		}, 100);
	});
}
$("#edit_warehouseTreeInsert_categoryId").keyup(function () {
	if ($(this).val().trim() === "") {
		poolConnect.then((pool) => {
			pool.request().execute("anbar.warehouse_category_search", (err, res) => {
				if (err !== null) console.log(err);
				edit_fillAddNewCategotyDropdown(res.recordset);
			});
		});

		return;
	}
	let text = $(this).val().trim();
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.warehouse_category_search", (err, res) => {
				if (err !== null) console.log(err);
				edit_fillAddNewCategotyDropdown(res.recordset);
			});
	});
});
function edit_fillClusterDefault(data) {
	$("#edit_warehouseClusterDefaultDropdown").empty();
	let parent = $("#edit_warehouseClusterDefaultDropdown");
	data.forEach((el) => {
		parent.append(
			`<p class="edit_dropdown-member-cluster-default" data-clusterDef="${el.cluster_default}"  data-clusterId="${el.cluster}">${el.title}</p>`
		);
	});

	$(".edit_dropdown-member-cluster-default").click(function () {
		$("#edit_warehouseTreeInsert_clusterTemplate").attr(
			"data-clusterDef",
			$(this).attr("data-clusterDef")
		);
		$("#edit_warehouseTreeInsert_clusterTemplate").attr(
			"data-clusterId",
			$(this).attr("data-clusterId")
		);
		$("#edit_warehouseTreeInsert_clusterTemplate").val($(this).html());
		setTimeout(() => {
			$("#edit_warehouseClusterDefaultDropdown").empty();
		}, 100);
	});
}
$("#edit_warehouseTreeInsert_clusterTemplate").keyup(function () {
	let text = $(this).val().trim();
	if (text !== "") {
		$(".edit_newClusterTemplateContainer").css({
			opacity: 0.6,
			"pointer-events": "none",
		});
	} else {
		$(".edit_newClusterTemplateContainer").css({
			opacity: 1,
			"pointer-events": "all",
		});
	}

	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", text)
			.execute("anbar.cluster_select_from_product", (err, res) => {
				if (err !== null) console.log(err);
				edit_fillClusterDefault(res.recordset);
			});
	});
});
setInterval(() => {
	if ($("#edit_warehouseTreeInsert_clusterTemplate").val() !== "") {
		$(".edit_newClusterTemplateContainer").css({
			opacity: 0.6,
			"pointer-events": "none",
		});
	} else {
		$(".edit_newClusterTemplateContainer").css({
			opacity: 1,
			"pointer-events": "all",
		});
	}
}, 400);
$("#editProduct").click(function () {
	showEditProduct(parseInt($(this).attr("data-productId")));
	hideProductOptions();
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
	hideProductOptions();
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
//                                SingleCategoryInfo part
// =====================================================================================

async function showCategoryInfo(categoryData) {
	$("#singleProductId").html("");
	$(".singleProductInfo").css("opacity", "0");
	$(".singleProductInfo").css("pointer-events", "unset");
	$(".singleProductInfo").css("z-index", "-1");

	let tmp = $(".treeView .tv-name");
	for (let i = 0; i < tmp.length; i++) {
		$(tmp[i]).attr("data-isselected", "false");
	}
	// Check if already opened
	console.log(categoryData);
	if ($("#singleCategoryId").html() == categoryData.id) {
		$("#singleCategoryId").html("");
		$(".singleCategoryInfo").css("opacity", "0");
		$(".singleCategoryInfo").css("pointer-events", "none");
		$(".singleCategoryInfo").css("z-index", "-1");
		return;
	}

	$("#singleCategoryName").html(categoryData.title);
	$("#singleCategoryId").html(categoryData.id);

	$(".singleCategoryInfo").css("opacity", "1");
	$(".singleCategoryInfo").css("pointer-events", "unset");
	$(".singleCategoryInfo").css("z-index", "1");
}

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
		row += `<td>${el.performed_by === undefined ? "-" : el.performed_by}</td>`;
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
	$("#singleCategoryId").html("");
	$(".singleCategoryInfo").css("opacity", "0");
	$(".singleCategoryInfo").css("pointer-events", "none");
	$(".singleCategoryInfo").css("z-index", "-1");

	// Check if already opened
	if ($("#singleProductId").html() == productData.product_id) {
		$("#singleProductId").html("");
		$(".singleProductInfo").css("opacity", "0");
		$(".singleProductInfo").css("pointer-events", "unset");
		$(".singleProductInfo").css("z-index", "-1");

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
				.input("product_id", BigInt(productData.product_id))
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
		$("#singleProductPriceOut").html(product_info.out_price);
		$("#singleProductCurrency").html(product_info.currency);
		$("#singleProductCell").html(product_info.product_cell);
		$("#singleProductExpDate").html(
			moment(product_info.exp_date).format("DD-MM-yyyy HH:mm:ss")
		);
		$("#singleProductInQuantity").html(product_info.in_quantity);
		$("#singleProductLeft").html(product_info.left);
		$("#singleProductOutQuantity").html(product_info.out_quantity);
	} catch (err) {
		$("#singleProductPrice").html("0");
		$("#singleProductCurrency").html("0");
		$("#singleProductCell").html("0");
		$("#singleProductExpDate").html("0");
		$("#singleProductInQuantity").html("0");
		$("#singleProductLeft").html("0");
		$("#singleProductOutQuantity").html("0");
	}

	let table_product = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool
				.request()
				.input("product_id", BigInt(productData.product_id))
				.execute("anbar.main_tree_click_table", (err, res) => {
					if (err !== null) console.log(err);
					resolve(res.recordset);
				});
		});
	});

	fillSingleProductTable(table_product);

	$(".singleProductInfo").css("opacity", "1");
	$(".singleProductInfo").css("pointer-events", "unset");
	$(".singleProductInfo").css("z-index", "1");
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
