var date_from, date_to;

var productExtraCharge, productQuantity, productReason;
var isProductChosen = false;
var productPrice, productExpDate, productClusterId, 
		productCell, productBarcode, productId, productCurrencyId,
		productDocumentId, productManufacture, productLeft;

var session_id = -1, session_info_id = -1;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
$("#createSessionDateFrom").attr("max", today);

poolConnect.then((pool) => {
  pool.request()
    .execute("dbo.currency_select", (err, res) => {
      let data = []
      for(let i of res.recordset){
        data.push(i);
      }
      console.log(res);
      for(let result of data){
        $("#sessionNewCurrencyId").append($("<option>", {value: result["id"], text: result["title"]}));
      }
    })
})

$("#createSessionPartButton").on("click", () => {
	$(".sessionSelectionPart").fadeToggle(200);
	$("#createSessionPartButton").css("visibility", "hidden");
	setTimeout(()=>{
		$(".sessionCreatePart").css("display", "flex");
	}, 200)
})

$("#getBack").on("click", () => {
	$(".sessionCreatePart").fadeOut(200);
	setTimeout(() => {
		$("#createSessionPartButton").css("visibility", "visible");
		$(".sessionSelectionPart").fadeIn(200);
	},200);
})

$("#selectSessionsButton").on("click", () => {
	date_from = $("#sessionsDateFrom").val();
	date_to = $("#sessionsDateTo").val();
	if(date_from.length == 0 || date_to.length == 0){
		alert("All fields must be filled");
		return;
	}
	fillSessions(date_from, date_to);
	$(".sessionSelectionPart").fadeOut(200);
	setTimeout(() => {
		$(".sessionListPart").fadeIn(200);
		$("#createSessionPartButton").fadeOut(10);
	},200);
})

$("#getBackFromSessionsList").on("click", () => {
	$(".sessionListPart").fadeOut(200);
	$(".sessionInfoList").fadeOut(200);
	$(".addNewSessionInfo").fadeOut(200);
	setTimeout(() => {
		$("#createSessionPartButton").fadeIn(10);
		$("#createSessionPartButton").css("visibility", "visible");
		$(".sessionSelectionPart").fadeIn(200);

	}, 200);
})

$("#addNewSessionInfo").on("click", () => {
	$(".sessionsPart").fadeOut(100);
	$(".sessionsInfoPart").fadeOut(100);

	setTimeout(() => {
		$(".sessionsInfoNewInputs").fadeIn(100);
		$(".sessionsInfoNewInputs").css("display", "flex");
		$(".sessionsInfoSearch").fadeIn(100);
		// $(".sessionsInfoSearch").css("display", "flex");
	}, 100);
})

$("#sessionInfoNewGetBack").on("click", () => {
	$(".sessionsInfoNewInputs").fadeOut(100);
	$(".sessionsInfoSearch").fadeOut(100);

	setTimeout(() => {
		$(".sessionsPart").fadeIn(100);
		$(".sessionsInfoPart").fadeIn(100);
	}, 100)
})

$("#infoSearchButton").on("click", () => {
	let value = $("#infoSearchInput").val();
	if(value.length == 0){
		alert("Field must be filled");
		return
	}
	fillSessionSearch(value);
	setTimeout(() => {
		$(".sessionsInfoSearchInputBlock").fadeOut(100);
		setTimeout(() => {
			$(".sessionSearchResult").fadeIn(100);
			$(".sessionSearchGetBack").fadeIn(100);
		}, 100);
	}, 50);
})

$("#searchBack").on("click", () => {
	$(".sessionSearchResult").fadeOut(100);
	$(".sessionSearchGetBack").fadeOut(100);
	setTimeout(() => {
		$(".sessionsInfoSearchInputBlock").fadeIn(100);
	},100);
})
$("#sessionInfoExtraCharge").change(() => {
	productExtraCharge = $("#sessionInfoExtraCharge").val();
	if(productPrice == NaN || productQuantity == NaN) return;
	$("#sessionInfoTotalPrice").val(productPrice * (1 + productExtraCharge) / 100 * productQuantity);
});

$("#sessionInfoQuantity").change(() => {
	productQuantity = $("#sessionInfoQuantity").val();
	if(productPrice == NaN || productQuantity == NaN) return;
	$("#sessionInfoTotalPrice").val(productPrice * (1 + productExtraCharge) / 100 * productQuantity);
})

$("#createSessionButton").on("click", () => {
	let dateFrom = $("#createSessionDateFrom").val();
	let dateTo = "01.01.2030";
	poolConnect.then((pool) => {
		pool.request()
				.input("begin_date", mssql.DateTime, dateFrom)
				.execute("dbo.retail_sale_create_new_session", (err, res) => {
					console.log("Session Create Error: \n", err, res);
					fillSessions(dateFrom, dateTo);
					$(".sessionCreatePart").fadeOut(100);
					setTimeout(() => {
						$(".sessionListPart").fadeIn(100);
						// $("#createSessionPartButton").fadeOut(10);
					}, 100);
				});
	});
});

$("#submitSession").on("click", () => {
	if(isProductChosen == false){
		alert("Choose the product");
		return;
	}
	productExtraCharge = $("#sessionInfoExtraCharge").val();
	productQuantity = $("#sessionInfoQuantity").val();
	productReason = $("#sessionInfoReason").val();
	productCurrencyId = $("#sessionNewCurrencyId").val();

	if(productExtraCharge.length == 0 || productQuantity.length == 0 || productReason.length == 0){
		alert("All the fields must be filled");
		return;
	}
	if(parseInt(productQuantity) > parseInt(productLeft)){
		alert("Entered quantity is bigger than left");
		return;
	}

	poolConnect.then((pool) => {
		pool.request()
				.input("extra_charge", mssql.Int, productExtraCharge)
				.input("currency", mssql.Int, productCurrencyId)
				.input("quantity", mssql.Int, productQuantity)
				.input("price", mssql.Float, productPrice)
				.input("exp_date", mssql.DateTime, productExpDate)
				.input("cluster_id", mssql.Int, productClusterId)
				.input("product_cell", mssql.Int, productCell)
				.input("barcode", mssql.BigInt, undefined)
				.input("product_id", mssql.Int, productId)
				.input("reason", mssql.NVarChar(250), productReason)
				.input("document_id_as_parent", mssql.BigInt, productDocumentId)
				.input("product_manufacturer", mssql.Int, productManufacture)
				.input("retail_sale_session_id", mssql.Int, session_id)
				.input("left", mssql.Float, productLeft)
				.execute("dbo.retail_sale_info_insert", (err, res) => {
					console.log(err);

					$(".sessionsInfoNewInputs").fadeOut(100);
					$(".sessionsInfoSearch").fadeOut(100);
					fillSessionsInfo(session_id);

					setTimeout(() => {
						$(".sessionsPart").fadeIn(100);
						$(".sessionsInfoPart").fadeIn(100);
						$("#acceptNewSessionInfo").fadeIn(0);
					}, 100)
				})
	})
})

$("#acceptNewSessionInfo").on("click", () => {
	poolConnect.then((pool) => {
		pool.request()
				.input("retail_sale_session_id", mssql.Int, session_id)
				.input("user_id", mssql.Int, USER["id"])
				.execute("dbo.retail_sale_info_accept_insert", (err, res) => {
					console.log(err);
					
					fillSessions(date_from, date_to);
					fillSessionsInfo(session_id);
					$("#acceptNewSessionInfo").fadeOut(0);
				})
	})
})

function fillSessions(dateFrom, dateTo){
	poolConnect.then((pool) => {
		pool.request()
				.input("date_from", mssql.DateTime, dateFrom)
				.input("date_to", mssql.DateTime, dateTo)
				.execute("dbo.retail_sale_session_selection", (err, res) => {
					console.log("Session Selection Error: \n",err, res);
					data = []
					for(let i of res.recordset){
						data.push(i);
					}
					$(".sessionContainer").remove();
					let counter = 0; 
					for(let i of data){
						console.log(counter);
						$(".sessionTables").append(
							`<div class="sessionContainer">
								<div class="sessionTable">
											<div class="sessionTableHeader">
												<div class="sessionHeaderItem">Begin Date</div>
												<div class="sessionHeaderItem">Cost Price</div>
												<div class="sessionHeaderItem">Is Done</div>
												<div class="sessionHeaderItem">Whole Price</div>
												<div class="sessionHeaderItem">Default Currency</div>
											</div>
											<div class="sessionTableContent">
												<div class="sessionTableRow">
													<div style="display:none;" id="sessionId">${i.id}</div>
													<div class="sessionTableData" title="${moment(i.begin_date).format("Da MMMM YYYY, h:mm:ss")}">${moment(
														i.begin_date
													).format("DD MMMM YYYY")}</div>
													<div class="sessionTableData">${i.cost_price}</div>
													<div class="sessionTableData">${i.is_done}</div>
													<div class="sessionTableData">${i.whole_price}</div>
													<div class="sessionTableData">${i.default_currency}</div>
												</div>
											</div>
										</div>
								</div>`
							);
							counter++;
						}
					let sessionCards = document.querySelectorAll(".sessionContainer");
					sessionCards.forEach((el) => {
						el.addEventListener("click", () => {
							sessionCards.forEach((sel) =>{
								sel.classList.remove("sessionSelected");
								sel.querySelector(".sessionTable").classList.remove("sessionSelected");
								sel.querySelector(".sessionTableHeader").classList.remove("sessionSelected");
								sel.querySelector(".sessionTableRow").classList.remove("sessionSelected");
							})
							// el.classList.toggle("sessionSelected");
							el.classList.toggle("sessionSelected");
							el.querySelector(".sessionTable").classList.toggle("sessionSelected");
							el.querySelector(".sessionTableHeader").classList.toggle("sessionSelected");
							el.querySelector(".sessionTableRow").classList.toggle("sessionSelected");
							session_id =  el.querySelector("#sessionId").textContent;

							fillSessionsInfo(session_id);
						})
					})
				})
	})
}


function fillSessionsInfo(session_id){
	poolConnect.then((pool) => {
		pool.request()
				.input("retail_sale_session_id", mssql.Int, session_id)
				.execute("dbo.retail_sale_session_info", (err, res) => {
					data = [];
					for(let i of res.recordset){
						data.push(i);
					}
					$(".sessionInfoContainer").remove();
					for(let i of data){
						$(".sessionInfoTables").append(
							`<div class="sessionInfoContainer">
									<div class="sessionInfoTable">
											<div class="sessionInfoTableHeader">
												<div class="sessionInfoHeaderItem">Product Title</div>
												<div class="sessionInfoHeaderItem">Expiry Date</div>
												<div class="sessionInfoHeaderItem">Quantity</div>
												<div class="sessionInfoHeaderItem">Product Unit</div>
												<div class="sessionInfoHeaderItem">Price For 1</div>
												<div class="sessionInfoHeaderItem">Extra Charge</div>
												<div class="sessionInfoHeaderItem">For Sale Price</div>
												<div class="sessionInfoHeaderItem">Full Price</div>
												<div class="sessionInfoHeaderItem">Currency</div>
												<div class="sessionInfoHeaderItem">Reason</div>
											</div>
											<div class="sessionInfoTableContent">
												<div class="sessionInfoTableRow">
													<div style="display:none;" id="sessionInfoId">${i.id}</div>
													<div style="display:none;" id="clusterId">${i.cluster_id}</div>
													<div class="sessionInfoTableData">${i.product_title}</div>
													<div class="sessionInfoTableData" title="${moment(i.exp_date).format("DD MMMM YYYY, h:mm:ss")}">${moment(
														i.exp_date
													).format("DD/MM/YYYY")}</div>
													<div class="sessionInfoTableData">${i.quantity}</div>
													<div class="sessionInfoTableData">${i.product_unit}</div>
													<div class="sessionInfoTableData">${i.pricefor1}</div>
													<div class="sessionInfoTableData">${i.extra_charge}</div>
													<div class="sessionInfoTableData">${i.for_sale_price}</div>
													<div class="sessionInfoTableData">${i.sum_price}</div>
													<div class="sessionInfoTableData">${i.currency_title}</div>
													<div class="sessionInfoTableData">${i.reason}</div>
												</div>
											</div>
									</div>
							 </div>`
						);
					}
					$(".sessionInfoList").fadeIn(100);
					// $("#acceptNewSessionInfo").fadeOut(0)
					$(".addNewSessionInfo").fadeIn(100);
					$(".addNewSessionInfo").css("display", 'flex');
				})
	})
}

function fillSessionSearch(value){
	poolConnect.then((pool) => {
		pool.request()
				.input("title", mssql.NVarChar(250), value)
				.execute("dbo.retail_sale_search", (err, res) => {
					if(err != null){
						return;
					}
					data = []
					for(let i of res.recordset){
						console.log(res.recordset)
						data.push(i);
					}
					$(".sessionSearchContainer").remove();
					for(let i of data){
						$(".sessionSearchTables").append(
							`<div class="sessionSearchContainer">
									<div class="sessionSearchTable">
											<div class="sessionSearchTableHeader">
												<div class="sessionSearchHeaderItem">Product Title</div>
												<div class="sessionSearchHeaderItem">Expiry Date</div>
												<div class="sessionSearchHeaderItem">In Quantity</div>
												<div class="sessionSearchHeaderItem">Out Quantity</div>
												<div class="sessionSearchHeaderItem">Left</div>
												<div class="sessionSearchHeaderItem">Price</div>
												<div class="sessionSearchHeaderItem">Currency</div>
											</div>
											<div class="sessionSearchTableContent">
												<div class="sessionSearchTableRow">
													<div style="display:none;" id="currencyId">${i.currency_id}</div>
													<div style="display:none;" id="clusterId">${i.cluster_id}</div>
													<div style="display:none;" id="productBarcode">${i.barcode}</div>
													<div style="display:none;" id="productId">${i.product_id}</div>
													<div style="display:none;" id="documentId">${i.document_id}</div>
													<div style="display:none;" id="productCell">${i.product_cell}</div>
													<div style="display:none;" id="productManufacturer">${i.product_manufacturer}</div>
													<div style="display:none;" id="productBarcode">${i.barcode}</div>
													<div class="sessionSearchTableData">${i.product_title}</div>
													<div class="sessionSearchTableData" id="productExpDate" title="${moment(i.exp_date).format("DD MMMM YYYY, h:mm:ss")}">${moment(
														i.exp_date
													).format("DD/MM/YYYY")}</div>
													<div class="sessionSearchTableData">${i.in_quantity}</div>
													<div class="sessionSearchTableData">${i.out_quantity}</div>
													<div class="sessionSearchTableData" id="productLeft">${i.left}</div>
													<div class="sessionSearchTableData" id="productPrice">${i.price}</div>
													<div class="sessionSearchTableData">${i.currency_title}</div>
												</div>
											</div>
									</div>
							 </div>`
						);
					}
					let sessionSearchResults = document.querySelectorAll(".sessionSearchContainer");
					sessionSearchResults.forEach((el) => {
						el.addEventListener("click", () => {
							sessionSearchResults.forEach((sel) => {
								sel.classList.remove("sessionSelected");
								sel.querySelector(".sessionSearchTable").classList.remove("sessionSelected");
								sel.querySelector(".sessionSearchTableHeader").classList.remove("sessionSelected");
								sel.querySelector(".sessionSearchTableRow").classList.remove("sessionSelected");
							});
							el.classList.toggle("sessionSelected");
							el.querySelector(".sessionSearchTable").classList.toggle("sessionSelected");
							el.querySelector(".sessionSearchTableHeader").classList.toggle("sessionSelected");
							el.querySelector(".sessionSearchTableRow").classList.toggle("sessionSelected");

							isProductChosen = true;
							
							productPrice = el.querySelector("#productPrice").textContent;
							productBarcode = el.querySelector("#productBarcode").textContent;
							productCell = el.querySelector("#productCell").textContent;
							productClusterId = el.querySelector("#clusterId").textContent;
							productCurrencyId = el.querySelector("#currencyId").textContent;
							productDocumentId = el.querySelector("#documentId").textContent;
							productExpDate = el.querySelector("#productExpDate").getAttribute("title");
							productId = el.querySelector("#productId").textContent;
							productLeft = el.querySelector("#productLeft").textContent;
							productManufacture = el.querySelector("#productManufacturer").textContent;
							$("#sessionInfoPrice").val(productPrice);
							$("#sessionNewCurrencyId").val(productCurrencyId);
							if(productExtraCharge != NaN && productQuantity != NaN){
								let total_price = productPrice* (1 + productExtraCharge) / 100 * productQuantity;
								$("#sessionInfoTotalPrice").val(total_price);
							}
						})
					})
				})
	})
}