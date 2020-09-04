// const { pool } = require("mssql");

console.log("inventory.js");
var products = {};
poolConnect.then((pool) => {
	pool.request().execute("anbar.products_return", (err, res) => {
		let data = [];
		for (let i of res.recordset) {
			data.push(i);
		}
		console.log(res);
		for (let result of data) {
			$("#productList").append(
				$("<option>", { value: result["product_id"], text: result["title"] })
			);
			products[result["product_id"]] = result["title"];
		}
	});
});

$("#backToStart").on("click", () => {
	$("#listContainer").slideUp(300);
	$("#inventoryStart").slideDown(300);
});

$("#listInventories").on("click", () => {
	poolConnect.then((pool) => {
		pool.request().execute("inventory.tables_list", (err, res) => {
			fillInventoryList(res.recordset);
			$("#inventoryStart").slideUp("fast");
			$("#listContainer").slideDown("fast");
		});
	});
});

$("#startInventory").on("click", () => {
	// $("#inventoryStart").fadeOut(100);
	poolConnect.then((pool) => {
		pool.request().execute("inventory.is_finished", (err, res) => {
			if (res.recordset[0].value == "1") {
				poolConnect.then((npool) => {
					npool.request().execute("inventory.start", (err, res) => {
						console.log("FINISHED");
						console.log(err, res);
						$("#inventoryStart").slideUp("slow");
						setTimeout(() => {
							$("#inventoryInput").slideDown("slow");
							$("#inventoryInput").css("display", "flex");
						}, 200);
					});
				});
			} else {
				poolConnect.then((npool) => {
					npool.request().execute("inventory.cont", (err, res) => {
						fillUnfinishedTable(res.recordset);
						$("#inventoryStart").slideUp("slow");
						setTimeout(() => {
							$("#inventoryInput").slideDown("slow");
							$("#inventoryInput").css("display", "flex");
						}, 200);
					});
				});
			}
		});
	});
});

$("#backInventory").click(() => {
	$("#inventoryInput").css("display", "none");
	$("#inventoryStart").css("display", "flex");
});

//Complete Inventory and get final result
$("#completeInventory").click(() => {
	$(".inventoryInputsContainer").slideUp("slow");
	//PERFORM STORED PROCEDURE 'inventory.finish'
	poolConnect.then((pool) => {
		pool.request().execute("inventory.finish", (err, res) => {
			console.log(err, res);
			setTimeout(() => {
				$("#finalTableContainer").slideDown("slow");
				$("#finalTableContainer").css("display", "flex");
			}, 500);
			fillFinishedTable(res.recordsets);
		});
	});
});

//Get Back To List
$("#backToList").on("click", () => {
	$("#listItemContainer").slideUp("fast");
	$("#listContainer").slideDown("fast");
});

//Get Back to Start Page of Inventory
$("#finishInventory").click(() => {
	$(".inventoryFinishedTableContainer").slideUp("slow");
	setTimeout(() => {
		$("#inventoryStart").slideDown("slow");
		$("#inventoryStart").css("display", "flex");
	}, 500);
	$("#inventoryItems").empty();
	$("#productId").val("");
	$("#itemQuantity").val("");
});

var closeButtons = document.getElementsByClassName("close");
var updateButtons = document.getElementsByClassName("update");
//ADD INPUT
function addInput() {
	let li = document.createElement("li");
	let inventoryQuantity = $("#itemQuantity").val();
	let inventoryId = $("#productId").val();
	let inventoryProduct = $("#productId option:selected").text();
	if (inventoryQuantity === "" || inventoryId === "") {
		return;
	} else {
		li.style.zIndex = "-2";
		document.getElementById("inventoryItems").appendChild(li);
		setTimeout(() => {
			li.className += "trans";
		}, 100);
		setTimeout(() => {
			li.style.zIndex = "10";
		}, 600);
	}
	let titleDiv = document.createElement("div");
	titleDiv.className = "inventoryItemContainer";
	poolConnect.then((pool) => {
		pool
			.request()
			.input("product_id", mssql.BigInt, inventoryId)
			.input("quantity_real", mssql.Float, inventoryQuantity)
			.execute("inventory.val_insert", (err, res) => {
				let productId = document.createElement("p");
				presult = res.recordset[0];
				productId.innerHTML = presult[""];
				productId.id = "prodId";
				productId.style.display = "none";
				titleDiv.appendChild(productId);
			});
	});

	$("#itemQuantity").val("");
	$("#productId").val("");

	let pId = document.createElement("p");
	pId.style.display = "none";
	pId.innerHTML = inventoryId;
	let pTitle = document.createElement("p");
	pTitle.innerHTML = inventoryProduct;
	pTitle.style.padding = "12px 16px";
	let pQuantity = document.createElement("p");
	pQuantity.style.textAlign = "center";
	pQuantity.innerHTML = inventoryQuantity;
	pQuantity.style.padding = "12px 16px";

	titleDiv.appendChild(pTitle);
	titleDiv.appendChild(pQuantity);
	titleDiv.appendChild(pId);

	li.appendChild(titleDiv);

	let buttonsDiv = document.createElement("div");
	buttonsDiv.className = "buttonsSpan";

	let updateButton = document.createElement("div");
	updateButton.className = "update";
	updateButton.innerHTML = "Update";
	let closeButton = document.createElement("div");
	closeButton.className = "close";
	closeButton.innerHTML = "Delete";
	buttonsDiv.appendChild(updateButton);
	buttonsDiv.appendChild(closeButton);

	li.appendChild(buttonsDiv);
	//CLOSE
	for (let i = 0; i < closeButtons.length; i++) {
		closeButtons[i].onclick = function () {
			let tempProdContainer = this.parentElement.parentElement;
			let tempProdID = tempProdContainer.querySelector("#prodId");
			poolConnect.then((pool) => [
				pool
					.request()
					.input("id", mssql.Int, tempProdID.textContent)
					.execute("inventory.val_delete", (err, res) => {
						console.log("Error", err);
						console.log("Result", res);
					}),
			]);
			var div = this.parentElement.parentElement;
			div.parentNode.removeChild(div);
		};
	}
	//UPDATE
	for (let i = 0; i < updateButtons.length; i++) {
		updateButtons[i].onclick = function () {
			let parentLi = this.parentElement.parentElement;

			$("#productId").val(
				parentLi.firstElementChild.children.item(2).textContent
			);
			$("#itemQuantity").val(
				parseInt(parentLi.firstElementChild.children.item(1).textContent)
			);
		};
	}
}

//FILL IF IS NOT FINISHED
function fillUnfinishedTable(data) {
	data.forEach((element) => {
		let li = document.createElement("li");
		let productTitle = products[element["product_id"]];
		let productQuantity = element["quantity_real"];

		li.style.opacity = "1";
		li.style.top = "0";
		let titleDiv = document.createElement("div");
		titleDiv.className = "inventoryItemContainer";

		let pTitle = document.createElement("p");
		pTitle.innerHTML = productTitle;
		pTitle.style.padding = "12px 16px";
		let pQuantity = document.createElement("p");
		pQuantity.innerHTML = productQuantity;
		pQuantity.style.padding = "12px 16px";

		titleDiv.appendChild(pTitle);
		titleDiv.appendChild(pQuantity);

		li.appendChild(titleDiv);
		document.getElementById("inventoryItems").appendChild(li);
		let buttonsDiv = document.createElement("div");
		buttonsDiv.className = "buttonsSpan";

		let updateButton = document.createElement("div");
		updateButton.className = "update";
		updateButton.innerHTML = "Update";
		let closeButton = document.createElement("div");
		closeButton.className = "close";
		closeButton.innerHTML = "Delete";
		buttonsDiv.appendChild(updateButton);
		buttonsDiv.appendChild(closeButton);

		li.appendChild(buttonsDiv);
		//CLOSE
		for (let i = 0; i < closeButtons.length; i++) {
			closeButtons[i].onclick = function () {
				let tempProdContainer = this.parentElement.parentElement;
				let tempProdID = tempProdContainer.querySelector("#prodId");
				poolConnect.then((pool) => [
					pool
						.request()
						.input("id", mssql.Int, tempProdID.textContent)
						.execute("inventory.val_delete", (err, res) => {
							console.log("Error", err);
							console.log("Result", res);
						}),
				]);
				var div = this.parentElement.parentElement;
				div.parentNode.removeChild(div);
			};
		}
		//UPDATE
		for (let i = 0; i < updateButtons.length; i++) {
			updateButtons[i].onclick = function () {
				let parentUl = this.parentElement.parentElement;

				$("#productId").val(element["product_id"]);
				$("#itemQuantity").val(
					parseInt(parentUl.firstElementChild.children.item(1).textContent)
				);
			};
		}
	});
}

//FILL FINISHED TABLE
function fillFinishedTable(data) {
	$("#inventoryFinishedTable").empty();
	$("#inventoryTotals").empty();
	let headLi = document.createElement("li");
	headLi.style.opacity = "1";
	let headDiv = document.createElement("div");
	headDiv.className = "inventoryItemContainer";
	headDiv.style.width = "100%";

	let head_title = document.createElement("p");
	head_title.innerHTML = "Title";
	head_title.style.padding = "12px 16px";

	let head_quantityEntered = document.createElement("p");
	head_quantityEntered.innerHTML = "Quantity in Anbar";
	head_quantityEntered.style.padding = "12px 16px";

	let head_quantityReal = document.createElement("p");
	head_quantityReal.innerHTML = "Quantity Real";
	head_quantityReal.style.padding = "12px 16px";

	let head_difference = document.createElement("p");
	head_difference.innerHTML = "Difference";
	head_difference.style.padding = "12px 16px";

	let head_priceDifference = document.createElement("p");
	head_priceDifference.innerHTML = "Price Difference";
	head_priceDifference.style.padding = "12px 16px";

	headDiv.appendChild(head_title);
	headDiv.appendChild(head_quantityReal);
	headDiv.appendChild(head_quantityEntered);
	headDiv.appendChild(head_difference);
	headDiv.appendChild(head_priceDifference);

	headLi.appendChild(headDiv);
	document.getElementById("inventoryFinishedTable").appendChild(headLi);

	let total = data[1];
	let counter = 0;
	for (let [keys, values] of Object.entries(total[0])) {
		let itemDiv = document.createElement("div");
		itemDiv.className = "item";

		let itemTitle = document.createElement("p");
		itemTitle.innerHTML = setTitle(counter);

		let itemValue = document.createElement("p");
		itemValue.innerHTML = counter == 3 ? parseFloat(values).toFixed(2) : values;

		itemDiv.appendChild(itemTitle);
		itemDiv.appendChild(itemValue);

		document.getElementById("inventoryTotals").appendChild(itemDiv);
		counter++;
	}

	let items = data[0];
	items.forEach((element) => {
		let li = document.createElement("li");
		li.style.opacity = "1";
		let titleDiv = document.createElement("div");
		titleDiv.className = "inventoryItemContainer";
		titleDiv.style.width = "100%";

		let productTitle = document.createElement("p");
		productTitle.innerHTML = element["title"];
		productTitle.style.padding = "12px 16px";

		let quantity_img = document.createElement("p");
		quantity_img.innerHTML = element["quantity_img"];
		quantity_img.style.padding = "12px 16px";

		let quantity_real = document.createElement("p");
		quantity_real.innerHTML = element["quantity_real"];
		quantity_real.style.padding = "12px 16px";

		let difference = document.createElement("p");
		difference.innerHTML = element["difference"];
		difference.style.padding = "12px 16px";

		let price_differnce = document.createElement("p");
		price_differnce.innerHTML = element["price_difference"];
		price_differnce.style.padding = "12px 16px";

		titleDiv.appendChild(productTitle);
		titleDiv.appendChild(quantity_real);
		titleDiv.appendChild(quantity_img);
		titleDiv.appendChild(difference);
		titleDiv.appendChild(price_differnce);

		li.appendChild(titleDiv);
		document.getElementById("inventoryFinishedTable").appendChild(li);
	});
}

function setTitle(counter) {
	switch (counter) {
		case 0:
			return "Total Entered";
		case 1:
			return "Total Real";
		case 2:
			return "Total Difference";
		case 3:
			return "Total Price";
		default:
			return "Something went wrong...";
	}
}

function fillInventoryList(data) {
	$("#inventoryListTable").empty();
	data.forEach((elem) => {
		let table_name = elem["table_name"];
		let creation_date = elem["creation_date"];

		let li = document.createElement("li");
		let div = document.createElement("div");
		div.className = "inventoryItemContainer";
		div.style.width = "100%";
		div.style.justifyContent = "space-around";
		let title = document.createElement("p");
		title.innerHTML = "Date:";

		let inventoryDate = document.createElement("p");
		inventoryDate.innerHTML = moment(creation_date).format(
			"YYYY/MM/DD hh:mm:ss"
		);
		// inventoryDate.style.justifySelf = 'center';

		div.appendChild(title);
		div.appendChild(inventoryDate);

		li.appendChild(div);
		document.getElementById("inventoryListTable").appendChild(li);
		li.onclick = function () {
			poolConnect.then((pool) => {
				pool
					.request()
					.input("table_name", mssql.NVarChar(250), table_name)
					.execute("inventory.custom_table_select", (err, res) => {
						console.log("Result:", res);
						console.log("Error:", err);

						$("#listContainer").slideUp(300);
						fillListItemTable(res.recordsets);
						setTimeout(() => {
							$("#listItemContainer").slideDown(500);
							$("#listItemContainer").css("display", "flex");
						}, 300);
					});
			});
		};
	});
}

function fillListItemTable(data) {
	$("#listItemFinalTable").empty();
	$("#listItemTotals").empty();
	let headLi = document.createElement("li");
	headLi.style.opacity = "1";
	let headDiv = document.createElement("div");
	headDiv.className = "inventoryItemContainer";
	headDiv.style.width = "100%";

	let head_title = document.createElement("p");
	head_title.innerHTML = "Title";
	head_title.style.padding = "12px 16px";

	let head_quantityEntered = document.createElement("p");
	head_quantityEntered.innerHTML = "Quantity in Anbar";
	head_quantityEntered.style.padding = "12px 16px";

	let head_quantityReal = document.createElement("p");
	head_quantityReal.innerHTML = "Quantity Real";
	head_quantityReal.style.padding = "12px 16px";

	let head_difference = document.createElement("p");
	head_difference.innerHTML = "Difference";
	head_difference.style.padding = "12px 16px";

	let head_priceDifference = document.createElement("p");
	head_priceDifference.innerHTML = "Price Difference";
	head_priceDifference.style.padding = "12px 16px";

	headDiv.appendChild(head_title);
	headDiv.appendChild(head_quantityReal);
	headDiv.appendChild(head_quantityEntered);
	headDiv.appendChild(head_difference);
	headDiv.appendChild(head_priceDifference);

	headLi.appendChild(headDiv);
	document.getElementById("listItemFinalTable").appendChild(headLi);

	let total = data[1];
	let counter = 0;
	for (let [keys, values] of Object.entries(total[0])) {
		let itemDiv = document.createElement("div");
		itemDiv.className = "item";

		let itemTitle = document.createElement("p");
		itemTitle.innerHTML = setTitle(counter);

		let itemValue = document.createElement("p");
		itemValue.innerHTML = counter == 3 ? parseFloat(values).toFixed(2) : values;

		itemDiv.appendChild(itemTitle);
		itemDiv.appendChild(itemValue);

		document.getElementById("listItemTotals").appendChild(itemDiv);
		counter++;
	}
	counter = 0;
	let items = data[0];
	items.forEach((element) => {
		let li = document.createElement("li");
		li.style.opacity = "1";
		let titleDiv = document.createElement("div");
		titleDiv.className = "inventoryItemContainer";
		titleDiv.style.width = "100%";

		let productTitle = document.createElement("p");
		productTitle.innerHTML = element["title"];
		productTitle.style.padding = "12px 16px";

		let quantity_img = document.createElement("p");
		quantity_img.innerHTML = element["quantity_img"];
		quantity_img.style.padding = "12px 16px";

		let quantity_real = document.createElement("p");
		quantity_real.innerHTML = element["quantity_real"];
		quantity_real.style.padding = "12px 16px";

		let difference = document.createElement("p");
		difference.innerHTML = element["difference"];
		difference.style.padding = "12px 16px";

		let price_differnce = document.createElement("p");
		price_differnce.innerHTML = element["price_difference"];
		price_differnce.style.padding = "12px 16px";

		titleDiv.appendChild(productTitle);
		titleDiv.appendChild(quantity_real);
		titleDiv.appendChild(quantity_img);
		titleDiv.appendChild(difference);
		titleDiv.appendChild(price_differnce);

		li.appendChild(titleDiv);
		document.getElementById("listItemFinalTable").appendChild(li);
	});
}
