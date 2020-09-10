// var date_from, date_to;

// var productExtraCharge = 0,
// 	productQuantity,
// 	productReason,
// 	productDiscount = 0;
// var isProductChosen = false;
// var productPrice,
// 	productExpDate,
// 	productClusterId,
// 	productCell,
// 	productBarcode,
// 	productId,
// 	productCurrencyId,
// 	productDocumentId,
// 	productManufacture,
// 	productLeft;

// var session_id = -1,
// 	session_info_id = -1;

// var today = new Date();
// var dd = today.getDate();
// var mm = today.getMonth() + 1; //January is 0!
// var yyyy = today.getFullYear();
// if (dd < 10) {
// 	dd = "0" + dd;
// }
// if (mm < 10) {
// 	mm = "0" + mm;
// }
// today = yyyy + "-" + mm + "-" + dd;
// $("#createSessionDateFrom").attr("max", today);
// $("#createSessionDateTo").attr("max", today);

// $("#sessionsDateFrom").attr("max", today);
// $("#sessionsDateTo").attr("max", today);

// var now = new Date();
// now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
// $("#sessionsDateTo").val(now.toISOString().slice(0, 10));
// var monthAgo = new Date();
// monthAgo.setMinutes(now.getMinutes() - now.getTimezoneOffset());
// monthAgo.addMonths(-1);
// $("#sessionsDateFrom").val(monthAgo.toISOString().slice(0, 10))


// function getTotalPrice() {
// 	return parseFloat(
// 		productPrice *
// 		productQuantity *
// 		(1 + parseInt(productExtraCharge) / 100) *
// 		(1 - productDiscount / 100)
// 	).toFixed(2);
// }

// poolConnect.then((pool) => {
// 	pool.request().execute("anbar.currency_select", (err, res) => {
// 		let data = [];
// 		for (let i of res.recordset) {
// 			data.push(i);
// 		}
// 		console.log(res);
// 		for (let result of data) {
// 			$("#sessionNewCurrencyId").append(
// 				$("<option>", { value: result["id"], text: result["title"] })
// 			);
// 		}
// 	});
// });

// $("#createSessionPartButton").on("click", () => {
// 	$(".sessionSelectionPart").fadeToggle(200);
// 	$("#createSessionPartButton").css("visibility", "hidden");
// 	setTimeout(() => {
// 		$(".sessionCreatePart").css("display", "flex");
// 	}, 200);
// });

// $("#getBack").on("click", () => {
// 	$(".sessionCreatePart").fadeOut(200);
// 	setTimeout(() => {
// 		$("#createSessionPartButton").css("visibility", "visible");
// 		$(".sessionSelectionPart").fadeIn(200);
// 	}, 200);
// });

// $("#selectSessionsButton").on("click", () => {
// 	date_from = $("#sessionsDateFrom").val();
// 	date_to = $("#sessionsDateTo").val();
// 	if (date_from.length == 0 || date_to.length == 0) {
// 		alert("All fields must be filled");
// 		return;
// 	}
// 	fillSessions(date_from, date_to);
// 	$(".sessionSelectionPart").fadeOut(200);
// 	setTimeout(() => {
// 		$(".sessionListPart").fadeIn(200);
// 		$("#createSessionPartButton").fadeOut(10);
// 	}, 200);
// });

// $("#getBackFromSessionsList").on("click", () => {
// 	$(".sessionListPart").fadeOut(200);
// 	$(".sessionInfoList").fadeOut(200);
// 	$(".addNewSessionInfo").fadeOut(200);
// 	setTimeout(() => {
// 		$("#createSessionPartButton").fadeIn(10);
// 		$("#createSessionPartButton").css("visibility", "visible");
// 		$(".sessionSelectionPart").fadeIn(200);
// 	}, 200);
// });

// $("#addNewSessionInfo").on("click", () => {
// 	$(".sessionsPart").fadeOut(100);
// 	$(".sessionsInfoPart").fadeOut(100);

// 	setTimeout(() => {
// 		$(".sessionsInfoNewInputs").fadeIn(100);
// 		$(".sessionsInfoNewInputs").css("display", "flex");
// 		$(".sessionsInfoSearch").fadeIn(100);
// 		// $(".sessionsInfoSearch").css("display", "flex");
// 	}, 100);
// });

// $("#sessionInfoNewGetBack").on("click", () => {
// 	$(".sessionsInfoNewInputs").fadeOut(100);
// 	$(".sessionsInfoSearch").fadeOut(100);

// 	setTimeout(() => {
// 		$(".sessionsPart").fadeIn(100);
// 		$(".sessionsInfoPart").fadeIn(100);
// 	}, 100);
// });

// $("#infoSearchButton").on("click", () => {
// 	let value = $("#infoSearchInput").val();
// 	if (value.length == 0) {
// 		alert("Field must be filled");
// 		return;
// 	}
// 	fillSessionSearch(value);
// 	setTimeout(() => {
// 		$(".sessionsInfoSearchInputBlock").fadeOut(100);
// 		setTimeout(() => {
// 			$(".sessionSearchResult").fadeIn(100);
// 			$(".sessionSearchGetBack").fadeIn(100);
// 		}, 100);
// 	}, 50);
// });

// $("#searchBack").on("click", () => {
// 	$(".sessionSearchResult").fadeOut(100);
// 	$(".sessionSearchGetBack").fadeOut(100);
// 	setTimeout(() => {
// 		$(".sessionsInfoSearchInputBlock").fadeIn(100);
// 	}, 100);
// });
// $("#sessionInfoExtraCharge").change(() => {
// 	productExtraCharge = $("#sessionInfoExtraCharge").val();
// 	if (productPrice == NaN || productQuantity == NaN) return;
// 	$("#sessionInfoTotalPrice").val(getTotalPrice());
// });

// $("#sessionInfoDiscount").change(() => {
// 	productDiscount = $("#sessionInfoDiscount").val();
// 	if (productPrice == NaN || productQuantity == NaN) return;
// 	$("#sessionInfoTotalPrice").val(getTotalPrice());
// });

// $("#sessionInfoQuantity").change(() => {
// 	productQuantity = $("#sessionInfoQuantity").val();
// 	if (productPrice == NaN || productQuantity == NaN) return;
// 	$("#sessionInfoTotalPrice").val(getTotalPrice());
// });

// $("#createSessionButton").on("click", () => {
// 	let dateFrom = $("#createSessionDateFrom").val();
// 	// let dateTo = "01.01.2030";
// 	console.log(dateFrom);
// 	poolConnect.then((pool) => {
// 		pool
// 			.request()
// 			.input("begin_date", mssql.DateTime, dateFrom)
// 			.execute("anbar.retail_sale_create_new_session", (err, res) => {
// 				console.log("Session Create Error: \n", err, res);
// 				fillSessions(dateFrom, new Date());
// 				$(".sessionCreatePart").fadeOut(100);
// 				$("#createSessionPartButton").fadeOut(100);
// 				setTimeout(() => {
// 					$(".sessionListPart").fadeIn(100);
// 					// $("#createSessionPartButton").fadeOut(10);
// 				}, 100);
// 			});
// 	});
// });

// $("#submitSession").on("click", () => {
// 	if (isProductChosen == false) {
// 		alert("Choose the product");
// 		return;
// 	}
// 	productExtraCharge = $("#sessionInfoExtraCharge").val();
// 	productQuantity = $("#sessionInfoQuantity").val();
// 	productReason = $("#sessionInfoReason").val();
// 	productCurrencyId = $("#sessionNewCurrencyId").val();
// 	productDiscount = $("#sessionInfoDiscount").val();
// 	if (
// 		productExtraCharge.length == 0 ||
// 		productQuantity.length == 0 ||
// 		productReason.length == 0
// 	) {
// 		alert("All the fields must be filled");
// 		return;
// 	}
// 	if (parseInt(productQuantity) > parseInt(productLeft)) {
// 		alert("Entered quantity is bigger than left");
// 		return;
// 	}

// 	poolConnect.then((pool) => {
// 		pool
// 			.request()
// 			.input("extra_charge", mssql.Int, productExtraCharge)
// 			.input("currency", mssql.Int, productCurrencyId)
// 			.input("quantity", mssql.Int, productQuantity)
// 			.input("price", mssql.Float, productPrice)
// 			.input("exp_date", mssql.DateTime, productExpDate)
// 			.input("cluster_id", mssql.Int, productClusterId)
// 			.input("product_cell", mssql.Int, productCell)
// 			.input("barcode", mssql.BigInt, 45684645654358)
// 			.input("product_id", mssql.Int, productId)
// 			.input("reason", mssql.NVarChar(250), productReason)
// 			.input("document_id_as_parent", mssql.BigInt, productDocumentId)
// 			.input("product_manufacturer", mssql.Int, productManufacture)
// 			.input("retail_sale_session_id", mssql.Int, session_id)
// 			.input("left", mssql.Float, productLeft)
// 			.input("discount", mssql.SmallInt, productDiscount)
// 			.execute("anbar.retail_sale_info_insert", (err, res) => {
// 				if(err != null){
// 					console.log(err);
// 					return;
// 				}
// 				session_info_id = res.recordset[0].rowid;
// 				$(".sessionsInfoNewInputs").fadeOut(100);
// 				$(".sessionsInfoSearch").fadeOut(100);
// 				fillSessionsInfo(session_id);

// 				setTimeout(() => {
// 					$(".sessionsPart").fadeIn(100);
// 					$(".sessionsInfoPart").fadeIn(100);
// 				}, 100);
// 				$("#acceptNewSessionInfo").fadeIn(0);
// 				$("#declineNewSessionInfo").fadeIn(0);
// 			});
// 	});
// });

// $("#acceptNewSessionInfo").on("click", function(){
// 	poolConnect.then((pool) => {
// 		pool
// 			.request()
// 			.input("retail_sale_session_id", mssql.Int, session_id)
// 			.input("user_id", mssql.Int, USER["id"])
// 			.execute("anbar.retail_sale_info_accept_insert", (err, res) => {
// 				console.log(err);
// 				$(this).fadeOut(70);
// 				$("#declineNewSessionInfo").fadeOut(70);
// 			});
// 	});
// });


// $("#declineNewSessionInfo").click(function(){
// 	poolConnect.then((pool) => {
// 		pool.request()
// 				.input("id", mssql.Int, session_info_id)
// 				.input("user_id", mssql.Int, USER['id'])
// 				.execute("anbar.retail_sale_session_info_delete", (err, res) => {
// 					if(err != null){
// 						console.log(err);
// 						return;
// 					}
// 					fillSessionsInfo(session_id);
// 					$(this).fadeOut(70);
// 					$("#acceptNewSessionInfo").fadeOut(70);
// 				})
// 	})
// })


// function fillSessions(dateFrom, dateTo) {
// 	// dateFrom = "20.07.2020";
// 	// dateTo = Date.now();
// 	poolConnect.then((pool) => {
// 		pool
// 			.request()
// 			.input("date_from", mssql.DateTime, dateFrom)
// 			.input("date_to", mssql.DateTime, dateTo)
// 			.execute("anbar.retail_sale_session_selection", (err, res) => {
// 				console.log("Session Selection Error: \n", err, res);
// 				data = [];
// 				for (let i of res.recordset) {
// 					data.push(i);
// 				}
// 				$("#sessions").empty();
// 				console.log(data);
// 				//todo TABLE HEADER
// 				let headLi = document.createElement("li");
// 				headLi.className += "title";
// 				let headDiv = document.createElement("div");
// 				headDiv.className = "inventoryItemContainer";
// 				headDiv.style.width = "100%";

// 				let head_BeginDate = document.createElement("p");
// 				head_BeginDate.innerHTML = languages['creation_date'];
// 				head_BeginDate.style.padding = "12px 16px";

// 				let head_CostPrice = document.createElement("p");
// 				head_CostPrice.innerHTML = languages['cost_price'];
// 				head_CostPrice.style.padding = "12px 16px";

// 				let head_DefaultCurrency = document.createElement("p");
// 				head_DefaultCurrency.innerHTML = languages['currency'];
// 				head_DefaultCurrency.style.padding = "12px 16px";

// 				let head_IsDone = document.createElement("p");
// 				head_IsDone.innerHTML = languages['status'];
// 				head_IsDone.style.padding = "12px 16px";

// 				let head_WholePrice = document.createElement("p");
// 				head_WholePrice.innerHTML = languages['total_price'];
// 				head_WholePrice.style.padding = "12px 16px";

// 				headDiv.appendChild(head_BeginDate);
// 				headDiv.appendChild(head_CostPrice);
// 				headDiv.appendChild(head_DefaultCurrency);
// 				headDiv.appendChild(head_IsDone);
// 				headDiv.appendChild(head_WholePrice);
// 				headLi.appendChild(headDiv);
// 				document.getElementById("sessions").appendChild(headLi);

// 				//todo TABLE BODY
// 				data.forEach((element) => {
// 					let li = document.createElement("li");
// 					li.style.opacity = "1";
// 					let titleDiv = document.createElement("div");
// 					titleDiv.className = "inventoryItemContainer";
// 					titleDiv.style.width = "100%";

// 					let sessionId = element.id;

// 					let sessionBegin = document.createElement("p");
// 					sessionBegin.textContent = moment(element.begin_date).format(
// 						"DD/MM/YYYY"
// 					);

// 					let sessionCost = document.createElement("p");
// 					sessionCost.textContent =
// 						element.cost_price == null
// 							? "Empty"
// 							: element.cost_price.toFixed(2);

// 					let sessionDefaultCurrency = document.createElement("p");
// 					sessionDefaultCurrency.textContent = element.default_currency;

// 					let sessionIsDone = document.createElement("p");
// 					sessionIsDone.textContent = element.is_done;

// 					let sessionWholePrice = document.createElement("p");
// 					sessionWholePrice.textContent =
// 						element.whole_price == null
// 							? "Empty"
// 							: element.whole_price.toFixed(2);

// 					titleDiv.appendChild(sessionBegin);
// 					titleDiv.appendChild(sessionCost);
// 					titleDiv.appendChild(sessionDefaultCurrency);
// 					titleDiv.appendChild(sessionIsDone);
// 					titleDiv.appendChild(sessionWholePrice);
// 					li.appendChild(titleDiv);
// 					li.onclick = function () {
// 						$("li").removeClass("checked");
// 						li.className += "checked";
// 						console.log(sessionId);
// 						session_id = sessionId;
// 						fillSessionsInfo(sessionId);
// 					};
// 					document.getElementById("sessions").appendChild(li);
// 				});
// 			});
// 	});
// }

// function fillSessionsInfo(sessionId) {
// 	poolConnect.then((pool) => {
// 		pool
// 			.request()
// 			.input("retail_sale_session_id", mssql.Int, sessionId)
// 			.execute("anbar.retail_sale_session_info", (err, res) => {
// 				data = [];
// 				for (let i of res.recordset) {
// 					data.push(i);
// 				}
// 				console.log(data);
// 				$("#sessionsInfo").empty();
// 				let headLi = document.createElement("li");
// 				headLi.className += "title";
// 				let headDiv = document.createElement("div");
// 				headDiv.className = "inventoryItemContainer";
// 				headDiv.style.width = "100%";

// 				let head_ProductTitle = document.createElement("p");
// 				head_ProductTitle.textContent = languages['product_name'];

// 				let head_ExpiryDate = document.createElement("p");
// 				head_ExpiryDate.textContent = languages['exp_date'];

// 				let head_Quantity = document.createElement("p");
// 				head_Quantity.textContent = languages['quantity'];

// 				let head_ProductUnit = document.createElement("p");
// 				head_ProductUnit.textContent = languages['unit'];

// 				let head_PriceForOne = document.createElement("p");
// 				head_PriceForOne.textContent = languages['unit_price'];

// 				let head_ExtraCharge = document.createElement("p");
// 				head_ExtraCharge.textContent = languages['extra_charge'];

// 				let head_ForSalePrice = document.createElement("p");
// 				head_ForSalePrice.textContent = languages['left_quantity'];

// 				let head_FullPrice = document.createElement("p");
// 				head_FullPrice.textContent = languages['total_price'];

// 				let head_Currency = document.createElement("p");
// 				head_Currency.textContent = languages['currency'];

// 				let head_Reason = document.createElement("p");
// 				head_Reason.textContent = languages["action"];

// 				headDiv.appendChild(head_ProductTitle);
// 				headDiv.appendChild(head_ExpiryDate);
// 				headDiv.appendChild(head_Quantity);
// 				headDiv.appendChild(head_ProductUnit);
// 				headDiv.appendChild(head_PriceForOne);
// 				headDiv.appendChild(head_ExtraCharge);
// 				headDiv.appendChild(head_ForSalePrice);
// 				headDiv.appendChild(head_FullPrice);
// 				headDiv.appendChild(head_Currency);
// 				headDiv.appendChild(head_Reason);

// 				headLi.appendChild(headDiv);
// 				document.getElementById("sessionsInfo").appendChild(headLi);
// 				data.forEach((element) => {
// 					let li = document.createElement("li");
// 					let div = document.createElement("div");
// 					div.className = "inventoryItemContainer";
// 					div.style.width = "100%";

// 					let productTitle = document.createElement("p");
// 					productTitle.innerHTML = element["product_title"];

// 					let expiryDate = document.createElement("p");
// 					expiryDate.innerHTML = moment(element["exp_date"]).format(
// 						"DD/MM/YYYY"
// 					);

// 					let quantity = document.createElement("p");
// 					quantity.innerHTML = element["quantity"];

// 					let productUnit = document.createElement("p");
// 					productUnit.innerHTML = element["unit_title"];

// 					let priceForOne = document.createElement("p");
// 					priceForOne.innerHTML = element["pricefor1"];

// 					let extraCharge = document.createElement("p");
// 					extraCharge.innerHTML = element["extra_charge"];

// 					let forSalePrice = document.createElement("p");
// 					forSalePrice.innerHTML = element["for_sale_price"].toFixed(2);

// 					let fullPrice = document.createElement("p");
// 					fullPrice.innerHTML = element["sum_price"].toFixed(2);

// 					let currency = document.createElement("p");
// 					currency.innerHTML = element["currency_title"];

// 					let reason = document.createElement("p");
// 					reason.innerHTML = element["reason"];

// 					div.appendChild(productTitle);
// 					div.appendChild(expiryDate);
// 					div.appendChild(quantity);
// 					div.appendChild(productUnit);
// 					div.appendChild(priceForOne);
// 					div.appendChild(priceForOne);
// 					div.appendChild(extraCharge);
// 					div.appendChild(forSalePrice);
// 					div.appendChild(fullPrice);
// 					div.appendChild(currency);
// 					div.appendChild(reason);

// 					li.appendChild(div);
// 					document.getElementById("sessionsInfo").appendChild(li);
// 				});
// 				$(".sessionInfoList").fadeIn(100);
// 				// $("#acceptNewSessionInfo").fadeOut(0)
// 				$(".addNewSessionInfo").fadeIn(100);
// 				$(".addNewSessionInfo").css("display", "flex");
// 			});
// 	});
// }

// function fillSessionSearch(value) {
// 	let parameterName = "";
// 	let parameterType = "";

// 	if (!isNaN(value)) {
// 		parameterName = "product_id";
// 		parameterType = mssql.Int;
// 	} else {
// 		parameterName = "title";
// 		parameterType = mssql.NVarChar(250);
// 	}
// 	poolConnect.then((pool) => {
// 		console.log(parameterName);
// 		pool
// 			.request()
// 			.input(parameterName, parameterType, value)
// 			.execute("anbar.retail_sale_search", (err, res) => {
// 				if (err) {
// 					console.log(err);
// 					return;
// 				}
// 				data = [];
// 				for (let i of res.recordset) {
// 					console.log(res.recordset);
// 					data.push(i);
// 				}
// 				$(".sessionSearchContainer").remove();
// 				for (let i of data) {
// 					$(".sessionSearchTables").append(
// 						`<div class="sessionSearchContainer">
// 									<div class="sessionSearchTable">
// 											<div class="sessionSearchTableHeader">
// 												<div class="sessionSearchHeaderItem">${languages['product_name']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['exp_date']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['in_quantity']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['out_quantity']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['left_quantity']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['unit']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['unit_price']}</div>
// 												<div class="sessionSearchHeaderItem">${languages['currency']}</div>
// 											</div>
// 											<div class="sessionSearchTableContent">
// 												<div class="sessionSearchTableRow">
// 													<div style="display:none;" id="currencyId">${i.currency_id}</div>
// 													<div style="display:none;" id="clusterId">${i.cluster_id}</div>
// 													<div style="display:none;" id="productBarcode">${i.barcode}</div>
// 													<div style="display:none;" id="productId">${i.product_id}</div>
// 													<div style="display:none;" id="documentId">${i.document_id}</div>
// 													<div style="display:none;" id="productCell">${i.product_cell}</div>
// 													<div style="display:none;" id="productManufacturer">${
// 						i.product_manufacturer
// 						}</div>
// 													<div style="display:none;" id="productBarcode">${i.barcode}</div>
// 													<div class="sessionSearchTableData">${i.product_title}</div>
// 													<div class="sessionSearchTableData" id="productExpDate" title="${moment(
// 							i.exp_date
// 						).format("DD MMMM YYYY, h:mm:ss")}">${moment(
// 							i.exp_date
// 						).format("DD/MM/YYYY")}</div>
// 													<div class="sessionSearchTableData">${i.in_quantity}</div>
// 													<div class="sessionSearchTableData">${i.out_quantity}</div>
// 													<div class="sessionSearchTableData" id="productLeft">${i.left}</div>
// 													<div class="sessionSearchTableData" id="productunit">${i.unit_title}</div>
// 													<div class="sessionSearchTableData" id="productPrice">${i.unit_price}</div>
// 													<div class="sessionSearchTableData">${i.currency_title}</div>
// 												</div>
// 											</div>
// 									</div>
// 							 </div>`
// 					);
// 				}
// 				let sessionSearchResults = document.querySelectorAll(
// 					".sessionSearchContainer"
// 				);
// 				sessionSearchResults.forEach((el) => {
// 					el.addEventListener("click", () => {
// 						sessionSearchResults.forEach((sel) => {
// 							sel.classList.remove("sessionSelected");
// 							sel
// 								.querySelector(".sessionSearchTable")
// 								.classList.remove("sessionSelected");
// 							sel
// 								.querySelector(".sessionSearchTableHeader")
// 								.classList.remove("sessionSelected");
// 							sel
// 								.querySelector(".sessionSearchTableRow")
// 								.classList.remove("sessionSelected");
// 						});
// 						el.classList.toggle("sessionSelected");
// 						el.querySelector(".sessionSearchTable").classList.toggle(
// 							"sessionSelected"
// 						);
// 						el.querySelector(".sessionSearchTableHeader").classList.toggle(
// 							"sessionSelected"
// 						);
// 						el.querySelector(".sessionSearchTableRow").classList.toggle(
// 							"sessionSelected"
// 						);

// 						isProductChosen = true;

// 						productPrice = el.querySelector("#productPrice").textContent;
// 						productBarcode = el.querySelector("#productBarcode").textContent;
// 						productCell = el.querySelector("#productCell").textContent;
// 						productClusterId = el.querySelector("#clusterId").textContent;
// 						productCurrencyId = el.querySelector("#currencyId").textContent;
// 						productDocumentId = el.querySelector("#documentId").textContent;
// 						productExpDate = el
// 							.querySelector("#productExpDate")
// 							.getAttribute("title");
// 						productId = el.querySelector("#productId").textContent;
// 						productLeft = el.querySelector("#productLeft").textContent;
// 						productManufacture = el.querySelector("#productManufacturer")
// 							.textContent;
// 						$("#sessionInfoPrice").val(productPrice);
// 						$("#sessionNewCurrencyId").val(productCurrencyId);
// 						if (productExtraCharge != NaN && productQuantity != NaN) {
// 							let total_price = getTotalPrice();
// 							$("#sessionInfoTotalPrice").val(total_price);
// 						}
// 					});
// 				});
// 			});
// 	});
// }

//=====================================================================
// Alert Part
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
	});
	$(".anbarAdd-container").css({
		filter: "brightness(100%)",
		"pointer-events": "all",
	});
	setTimeout(() => {
		$(".cstmAlertBox").css("display", "none");
	}, 600);
}


var selectedSession 	  = null;
var selectedSessionInfo = null;

//======================================================================
// Moveable border Part
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
			moveBlockBy = parseInt($(".retails").css("height").slice(0, -2)) + moveLineBy;
			if (
				moveBlockBy < $(document).height() * 0.65 &&
				moveBlockBy > $(document).height() * 0.15
			) {
				prevMouseY = currentMousePos.y;
				$(".moveableBorder").css("top", moveLineBy);
				$(".retails").css("height", moveBlockBy);
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
	$(".retails").css("height", "50%");
});
$(document).mouseup(function () {
	clearInterval(timeout);
	return false;
});

//=======================================================================
// Set dates to input[type='date']

function getNow(){
	let now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now;
}

function getMonthsAgo(numberOfMonths){
	let currenyDate = getNow();
	var monthAgo = new Date();
	monthAgo.setMinutes(currenyDate.getMinutes() - currenyDate.getTimezoneOffset());
	monthAgo.addMonths(-numberOfMonths);
	return monthAgo;
}

$("#dateTo").val(getNow().toISOString().slice(0, 10));
$("#dateFrom").val(getMonthsAgo(1).toISOString().slice(0, 10))

getAllRetailSessions($("#dateFrom").val(), $("#dateTo").val())
//========================================================================


//========================================================================
// Change listener for date inputs
$("#dateFrom").change(function(){
	if($("#dateTo").val() == ""){
		return;
	}
	getAllRetailSessions(
		$(this).val(),
		$("#dateTo").val()
	)
})


$("#dateTo").change(function(){
	if($("#dateFrom").val() == ""){
		return;
	}
	getAllRetailSessions(
		$("#dateFrom").val(),
		$(this).val()
	)
})
//========================================================================


//========================================================================
// Retail Sessions
function getAllRetailSessions(dateFrom, dateTo){
	poolConnect.then((pool) => {
		pool.request()
				.input("date_from", mssql.DateTime, dateFrom)
				.input("date_to", mssql.DateTime, dateTo)
				.execute("anbar.retail_sale_session_selection", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					console.log(res.recordset);
					fillRetailsTable(res.recordset);
				})
	})
}

function fillRetailsTable(data){
	$(".anbarRemoveRetailTable").remove();

	$(".retailsTable").append("<table class='anbarRemoveRetailTable'></table>");
	$(".anbarRemoveRetailTable").append("<thead></thead>");
	$(".anbarRemoveRetailTable").append("<tbody></tbody>");

	$(".anbarRemoveRetailTable > thead").append(`<th>Begin Date</th>`);
	$(".anbarRemoveRetailTable > thead").append(`<th>Cost Price</th>`);
	$(".anbarRemoveRetailTable > thead").append(`<th>Default Currency</th>`);
	$(".anbarRemoveRetailTable > thead").append(`<th>Is Done</th>`);
	$(".anbarRemoveRetailTable > thead").append(`<th>Whole Price</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-retail" data-done='${el.is_done}' data-id='${el.id}'>`;

		row += `<td title="${moment(el.begin_date).format("DD MMMM YYYY hh:mm:ss")}">
			${moment(el.begin_date).format("DD MMMM YYYY")}
		</td>`

		row += `<td>${el.cost_price == null ? "Empty" : el.cost_price.toFixed(2)}</td>`
		row += `<td>${el.default_currency}</td>`
		row += `<td>${el.is_done}</td>`
		row += `<td>${el.whole_price == null ? "Empty" : el.whole_price.toFixed(2)}</td>`
		row += "</tr>";

		$(".anbarRemoveRetailTable > tbody").append(row);
	});

	if (data.length < 9) {
		for (let i = 0; i < 9 - data.length; i++) {
			let row = "<tr class='empty-single-retail' style='height: 40px'>";

			for (let j = 0; j < 5; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarRemoveRetailTable > tbody").append(row);
		}
	}

	$(".single-retail").click(function () {
		$(".single-retail").attr("data-isSelected2", "False");
		$(this).attr("data-isSelected2", "True");
		getRetailSessionsInfo($(this).attr("data-id"));
	});
	$(".single-retail").contextmenu(function () {
		ShowSingleRetailOptions($(this));
	});
	$(".empty-single-retail").contextmenu(function () {
		ShowSingleRetailOptions($(this));
	});
}

function refreshRetailsTable(date_from, date_to, timeout = 0) {
	setTimeout(() => {
		getAllRetailSessions(
			date_from,
			date_to
		);
	}, timeout);
}
//=======================================================================


//=======================================================================
// Retail Session Info 
function getRetailSessionsInfo(id){
	selectedSession = id;
	poolConnect.then((pool) => {
		pool.request()
				.input("retail_sale_session_id", mssql.Int, selectedSession)
				.execute("anbar.retail_sale_session_info", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					console.log(res.recordset);
					fillRetailSessionInfoTable(res.recordset);
				})
	})
}

function fillRetailSessionInfoTable(data){
	$("#defaultSessionsText").attr("data-isTableShowing", "True");

	$(".anbarRemoveSessionsInfoTable").remove();
	$(".sessionsInfo-table").append("<table class='anbarRemoveSessionsInfoTable'></table>");
	$(".anbarRemoveSessionsInfoTable").append("<thead></thead>");
	$(".anbarRemoveSessionsInfoTable").append("<tbody></tbody>");

	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['product_name']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['exp_date']}</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['quantity']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['unit']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['unit_price']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['extra_charge']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['discount']}(%):</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['for_sale_price']}:</th>`);	
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['total_price']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['currency']}:</th>`);
	$(".anbarRemoveSessionsInfoTable > thead").append(`<th>${languages['action']}:</th>`);	

	data.forEach((el) => {
		let row = `<tr class="retail-single-session-info" data-id='${el.id}' data-sessionId='${selectedSession}'>`;
		row += `<td>${el.product_title}</td>`
		row += `<td 
			title='${moment(el.exp_date).format("DD MMMM YYYY hh:mm:ss")}'>
			${moment(el.exp_date).format("DD MMMM YYYY")}
		</td>`
		row += `<td>${el.quantity}</td>`
		row += `<td>${el.unit_title}</td>`
		row += `<td>${el.pricefor1.toFixed(2)}</td>`
		row += `<td>${el.extra_charge}</td>`
		row += `<td>${el.discount}</td>`
		row += `<td>${el.for_sale_price.toFixed(2)}</td>`
		row += `<td>${el.sum_price.toFixed(2)}</td>`
		row += `<td>${el.currency_title}</td>`
		row += `<td>${el.reason}</td>`
		row += `</tr>`
		$(".anbarRemoveSessionsInfoTable > tbody").append(row);
	})
	if (data.length < 17) {
		for (let i = 0; i < 17 - data.length; i++) {
			let row = "<tr class='empty-single-retail-session-info' style='height: 40px'>";

			for (let j = 0; j < 11; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".anbarRemoveSessionsInfoTable > tbody").append(row);
		}
	}
	$(".retail-single-session-info").contextmenu(function () {
		console.log($(this));
		showSingleSessionInfoOptions($(this));
	});
	$(".empty-single-retail-session-info").contextmenu(function () {
		console.log($(this));
		showSingleSessionInfoOptions($(this));
	});
}

function refreshRetailSessionsInfo(timeout = 0, id){
	
	setTimeout(() => {
		getRetailSessionsInfo(selectedSession);
	}, timeout)
}
//=======================================================================

//=======================================================================
// Retail Session Optoins Part
function ShowSingleRetailOptions(retailEl){
	$("#optionsAccept").hide();
	$("#optionsEndAll").hide();
	$("#optionsEdit").hide();
	if(retailEl.attr("class") == "empty-single-retail"){
		$(".single-retail").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsDelete").hide();
		$("#optionsMenu").attr("data-belongsTo", "Retail");
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
	$(".single-retail").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");
	$("#optionsDelete").show();
	$("#optionsEndAll").show();
	$("#optionsMenu").attr("data-belongsTo", "Retail");
	$("#optionsMenu").css({
		top:
			currentMousePos.y -
			$(document).height() * 0.09 -
			$($(".optionsBtn")[0]).height() / 2 +
			5,
		left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
	});
	retailEl.attr("data-isSelected", "True");
	$("#optionsDelete").attr("data-retailId", retailEl.attr("data-id"));
	$("#optionsDelete").attr("title", "Delete bulk");
	$("#optionsEndAll").attr("title", "End Session")
	$("#optionsEndAll").attr("data-id", retailEl.attr("data-id"));
	$("#optionsNew").attr("title", "Add new bulk");
	$(".optionsBtn").attr("data-isActive", "True");

}

$("#optionsDelete").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Retail") {
		return;
	}
	showAlert("Are you sure you want to delete this retail session?").then((res) => {
		if (res) {
			deleteRetailSession($(this).attr("data-retailId"));
			refreshRetailsTable($("#dateFrom").val(), $("#dateTo").val());
		}
		closeAlert();
	});
});

$("#optionsNew").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "Retail") {
		return;
	}
	showAddNewRetailSessionForm();
});

async function showAddNewRetailSessionForm(){
	$("#addNewRetailBeginDate").val(getMonthsAgo(1).toISOString().slice(0, 10));

	$(".anbarRemoveContainer").css({
		"pointer-events": "none",
	});
	$(".addNewRetailSessionForm").css({
		opacity: "1",
		display: "flex",
		"pointer-events": "all",
	});
	$(".addNewRetailSessionForm").attr("data-isActive", "True");
}

function hideAddNewRetailSessionForm(){
	$(".anbarRemoveContainer").css({
		"pointer-events": "all",
	});
	$(".addNewRetailSessionForm").css({
		opacity: "0",
	});
	$(".addNewRetailSessionForm").attr("data-isActive", "False");
	setTimeout(() => {
		$(".addNewRetailSessionForm").css("display", "none");
	}, 400);
} 

function deleteRetailSession(id){
	poolConnect.then((pool) => {
		pool.request()
				.input("id", mssql.Int, id)
				.input("user_id", mssql.Int, USER['id'])
				.execute("anbar.retail_sale_session_delete", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					refreshRetailsTable($("#dateFrom").val(), $("#dateTo").val());
				})

	})
}

$("#addNewRetailSessionDiscardBtn").click(function(){
	hideAddNewRetailSessionForm();
})

$("#addNewRetailSessionSubmitBtn").click(function(){
	poolConnect.then((pool) => {
		pool.request()
				.input("begin_date", mssql.DateTime, $("#addNewRetailBeginDate").val())
				.execute("anbar.retail_sale_create_new_session", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					$("#dateFrom").val($("#addNewRetailBeginDate").val());
					refreshRetailsTable($("#dateFrom").val(), getNow().toISOString().slice(0, 10));
					hideAddNewRetailSessionForm();
				})
	})
})

$(document).click((el) => {
	$(".single-retail").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");

	// if ($(".addNewRetailSessionForm").attr("data-isActive") === "True") {
	// 	if (
	// 		$(el.target).attr("class") !== "addNewRetailSessionForm" &&
	// 		$.inArray(el.target, $(".addNewRetailSessionForm").children()) < 0 &&
	// 		$.inArray($(el.target).parent()[0], $(".addNewRetailSessionForm").children()) < 0 &&
	// 		$.inArray($(el.target).parent().parent()[0], $(".addNewRetailSessionForm").children()) < 0
	// 	) {
	// 		hideAddNewRetailSessionForm();
	// 	}
	// }
});
//=======================================================================

//=======================================================================
// Retail Sessions Info Options part
function showSingleSessionInfoOptions(sessionEl){
	$("#optionsEdit").hide();
	if (sessionEl.attr("class") === "empty-single-retail-session-info") {
		$(".retail-single-session-info").attr("data-isSelected", "False");
		$(".optionsBtn").attr("data-isActive", "False");
		$("#optionsAccept").hide();
		$("#optionsDelete").hide();
		$("#optionsEndAll").hide();
		$("#optionsMenu").attr("data-belongsTo", "SessionsInfo");
		$("#optionsMenu").css({
			top:
				currentMousePos.y -
				$(document).height() * 0.09 -
				$($(".optionsBtn")[0]).height() / 2 +
				5,
			left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
		});

		$("#optionsNew").attr("title", "Add new session info");
		$(".optionsBtn").attr("data-isActive", "True");
		return;
	}
	$(".retail-single-session-info").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");
	// $("#optionsAccept").show();
	$("#optionsEndAll").show();
	$("#optionsDelete").show();
	$("#optionsMenu").attr("data-belongsTo", "SessionsInfo");
	$("#optionsMenu").css({
		top:
			currentMousePos.y -
			$(document).height() * 0.09 -
			$($(".optionsBtn")[0]).height() / 2 +
			5,
		left: currentMousePos.x - $($(".optionsBtn")[0]).height() / 2 - 15,
	});
	sessionEl.attr("data-isSelected", "True");
	$("#optionsDelete").attr("data-sessionInfoId", sessionEl.attr("data-id"));
	$("#optionsDelete").attr("title", "Delete session");
	$("#optionsEndAll").attr("data-sessionId", sessionEl.attr("data-sessionId"));
	$("#optionsEndAll").attr("title", "Accept all session infos");
	$("#optionsNew").attr("title", "Add new session info");
	$(".optionsBtn").attr("data-isActive", "True");
}

$("#optionsEndAll").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "SessionsInfo") {
		return;
	}
	showAlert("Are you sure you want to accept these session's infos?").then(
		(res) => {
			if (res) {
				acceptAllInsert($(this).attr("data-sessionId"));
				refreshRetailSessionsInfo(400);
				refreshRetailsTable($("#dateFrom").val(), $("#dateTo").val(), 400);
			}
			closeAlert();
		}
	);
});

$("#optionsDelete").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "SessionsInfo") {
		return;
	}
	showAlert("Are you sure you want to delete this session's info?").then((res) => {
		if (res) {
			deleteSession($(this).attr("data-sessionInfoId"));
			refreshRetailSessionsInfo(400)
		}
		closeAlert();
	});
});

$("#optionsNew").click(function () {
	if ($("#optionsMenu").attr("data-belongsTo") !== "SessionsInfo") {
		return;
	}
	// $("#addNewSessionVOEN").val("");
	showAddNewSessionInfoForm();
});

function acceptAllInsert(sessionId){
	poolConnect.then((pool) => {
		pool.request()
				.input("retail_sale_session_id", mssql.Int, sessionId)
				.input("user_id", mssql.Int, USER['id'])
				.execute("anbar.retail_sale_info_accept_insert", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
				})
	})
}

function deleteSession(id){
	poolConnect.then((pool) => {
		pool.request()
				.input("id", mssql.Int, id)
				.input("user_id", mssql.Int, USER['id'])
				.execute("anbar.retail_sale_session_info_delete", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
				})
	})
}

function showAddNewSessionInfoForm(){
	$(".anbarRemoveContainer").css({
		"pointer-events": "none",
	});
	$(".addNewSessionInfoForm").css({
		opacity: "1",
		display: "flex",
		"pointer-events": "all",
	});
	poolConnect.then((pool) => {
		pool.request().execute("anbar.currency_select", (err, res) => {
			let data = [];
			for (let i of res.recordset) {
				data.push(i);
			}
			console.log(res);
			for (let result of data) {
				$("#productCurrency").append(
					$("<option>", { value: result["id"], text: result["title"] })
				);
			}
		});
	});
	$(".addNewSessionInfoForm").attr("data-isActive", "True");
}

$(document).click((el) => {
	$(".retail-single-session-info").attr("data-isSelected", "False");
	$(".optionsBtn").attr("data-isActive", "False");

	// if ($(".addNewSessionInfoForm").attr("data-isActive") === "True") {
	// 	if ($.inArray(el.target, $("#optionsMenu img")) != -1) {
	// 		return;
	// 	}
	// 	if (
	// 		$(el.target).attr("class") !== "addNewSessionForm" &&
	// 		$.inArray(el.target, $(".addNewSessionForm").children()) < 0 &&
	// 		$.inArray($(el.target).parent()[0], $(".addNewSessionForm").children()) < 0 &&
	// 		$.inArray($(el.target).parent().parent()[0], $(".addNewSessionForm").children()) < 0
	// 	) {
	// 		hideAddNewSessionForm();
	// 	}
	// }
});

//=====================================================================
// Add New Session Info part

$("#searchProduct").click(function(){
	if($("#valueForSearch").val() != ""){
		$("#searchInputs").fadeOut(10);
		getSearchProducts($("#valueForSearch").val())
		$("#getBackToSearchInput").fadeIn(10);
	}
})

function getSearchProducts(value){
	$(".sessionsInfoSearch-table").fadeIn(10);
	let parameterName = "";
	let parameterType = "";

	if (!isNaN(value)) {
		parameterName = "product_id";
		parameterType = mssql.Int;
	} else {
		parameterName = "title";
		parameterType = mssql.NVarChar(250);
	}

	poolConnect.then((pool) => {
		pool.request()
				.input(parameterName, parameterType, value)
				.execute("anbar.retail_sale_search", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					fillRetailSessionSearchTable(res.recordset);
				})
	})
}

var retailSearch_productId = null;
var retailSearch_currencyId = null;
var retailSearch_barcode = null;
var retailSearch_documentId = null;
var retailSearch_productCell = null;
var retailSearch_productManufacturer = null;
var retailSeatch_productLeft = null;
var retailSearch_expDate = null;


function fillRetailSessionSearchTable(data){
	$(".anbarRemoveSessionsInfoSearchTable").remove();
	$(".sessionsInfoSearch-table").append("<table class='anbarRemoveSessionsInfoSearchTable'></table>")
	$(".anbarRemoveSessionsInfoSearchTable").append("<thead></thead>")
	$(".anbarRemoveSessionsInfoSearchTable").append("<tbody></tbody>")

	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['product_name']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['exp_date']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['in_quantity']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['out_quantity']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['left_quantity']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['unit']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['unit_price']}</th>`)
	$(".anbarRemoveSessionsInfoSearchTable > thead").append(`<th>${languages['currency']}</th>`)

	data.forEach((i) => {
		let row = `<tr class='retail-single-searchResult'
			data-productId="${i.product_id}" 
			data-currencyId="${i.currency_id}" 
			data-barcode="${i.barcode}" 
			data-documentId="${i.document_id}" 
			data-prductCell="${i.product_cell}" 
			data-productManufacturer="${i.product_manufacturer}" 
			data-productUnitPrice="${i.unit_price}"
			data-productLeft="${i.left}"
			data-productExpDate="${i.exp_date}"
		>`;
		row += `<td>${i.product_title}</td>`
		row += `<td title="${moment(i.exp_date).format('DD MMMM YYYY hh:mm:ss')}">
			${moment(i.exp_date).format("DD MMMM YYYY")}
		</td>`
		row += `<td>${i.in_quantity}</td>`
		row += `<td>${i.out_quantity}</td>`
		row += `<td>${i.left}</td>`
		row += `<td>${i.unit_title}</td>`
		row += `<td>${i.unit_price}</td>`
		row += `<td>${i.currency_title}</td>`
		row += '</tr>'
		$(".anbarRemoveSessionsInfoSearchTable > tbody").append(row);
	});
	if(data.length < 4){
		for(let i = 0;i < 4 - data.length; i++){
			let row = "<tr class='empty-single-retail-search-product' style='height: 40px'>"
			for(let j = 0;j < 8; j++){
				row += "<td></td>";
			}
			row += "</tr>";
			$(".anbarRemoveSessionsInfoSearchTable > tbody").append(row);
		}
	}
	$(".retail-single-searchResult").click(function(){
		$(".retail-single-searchResult").attr("data-isSelected", "False");
		$(this).attr("data-isSelected","True");
		retailSearch_productId = $(this).attr("data-productId");
		retailSearch_currencyId = $(this).attr("data-currencyId");
		retailSearch_barcode = $(this).attr("data-barcode");
		retailSearch_documentId = $(this).attr("data-documentId");
		retailSearch_productCell = $(this).attr("data-productCell");
		retailSearch_productManufacturer = $(this).attr("data-productManufacturer");
		retailSeatch_productLeft = $(this).attr("data-productLeft");
		retailSearch_expDate = $(this).attr("data-productExpDate");
		$("#productCurrency").val(retailSearch_currencyId);
		$("#productPrice").val($(this).attr("data-productUnitPrice"));
		console.log(retailSearch_productId);
		fillClustersDropdown(retailSearch_productId);

	});
}

function fillClustersDropdown(productId){
	poolConnect.then((pool) => {
		pool.request()
				.input("product_id", mssql.BigInt, productId)
				.execute("anbar.cluster_names_select_all_for_specific_product", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					let data = [];
					for (let i of res.recordset) {
						data.push(i);
					}
					console.log(res);
					for (let result of data) {
						$("#productCluster").append(
							$("<option>", { value: result["cluster_order"], text: result["title"] })
						);
					}
				})
	})
}

$("#getBackToSearchInput").click(function(){
	$(".sessionsInfoSearch-table").fadeOut(100);
	$("#getBackToSearchInput").fadeOut(100);
	setTimeout(() => {
		$("#searchInputs").fadeIn(100);

	}, 100);
})

$("#retailAddNewSessionDiscardBtn").click(() => {
	hideAddNewSessionInfoForm();
});

$("#retailAddNewSessionSubmitBtn").click(() => {
	poolConnect.then((pool) => {
		pool.request()
				.input("extra_charge", mssql.Int, $("#productExtraCharge").val())
				.input("currency", mssql.Int, $("#productCurrency").val())
				.input("quantity", mssql.Int, $("#productQuantity").val())
				.input("discount", mssql.SmallInt, $("#productDiscount").val())
				.input("reason", mssql.NVarChar(250), $("#productReason").val())
				.input("cluster_order", mssql.Int, $("#productCluster").val())
				.input("price", mssql.Float, $("#productPrice").val())
				.input("exp_date", mssql.DateTime, retailSearch_expDate)
				.input("product_cell", mssql.Int, retailSearch_productCell)
				.input("barcode", mssql.BigInt, retailSearch_barcode)
				.input("product_id", mssql.Int, retailSearch_productId)
				.input("document_id_as_parent", mssql.BigInt, retailSearch_currencyId)
				.input("product_manufacturer", mssql.Int, retailSearch_productManufacturer)
				.input("retail_sale_session_id", mssql.Int, selectedSession)
				.input("left", mssql.Int, retailSeatch_productLeft)
				.execute("anbar.retail_sale_info_insert", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					refreshRetailSessionsInfo(timeout=10, selectedSession)
					$(".addNewSessionInfoForm input").val("");
					$("#getBackToSearchInput").trigger("click");
					$("#productCluster").empty();
				})
	})
})
function hideAddNewSessionInfoForm() {
	$(".anbarRemoveContainer").css({
		"pointer-events": "all",
	});
	$(".addNewSessionInfoForm").css({
		opacity: "0",
	});
	$(".addNewSessionInfoForm").attr("data-isActive", "False");
	setTimeout(() => {
		$(".addNewSessionInfoForm").css("display", "none");
	}, 600);
}

$("#productQuantity").change(() => {
	if($("#productPrice").val() != ""){
		$("#productTotalPrice").val(getTotalPrice());
	}
})

$("#productPrice").change(() => {
	if($("#prodcuctQuantity").val() != ""){
		$("#productTotalPrice").val(getTotalPrice());		
	}
})

$("#productExtraCharge").change(() => {
	if($("#productQuantity").val() != "" || $("#productPrice").val() != ""){
		$("#productTotalPrice").val(getTotalPrice());
	}
})

$("#productDiscount").change(() => {
	if($("#productQuantity").val() != "" || $("#productPrice").val() != ""){
		$("#productTotalPrice").val(getTotalPrice());
	}
})

function getTotalPrice() {
	return parseFloat(
		$("#productPrice").val() *
		$("#productQuantity").val() *
		(1 + parseInt(($("#productExtraCharge").val() == "" ? 0 : $("#productExtraCharge").val() )) / 100) *
		(1 - ($("#productDiscount").val() == "" ? 0 : $("#productDiscount").val()) / 100)
	).toFixed(2);
}

//=====================================================================