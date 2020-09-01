var date_from, date_to;

var productExtraCharge = 0, productQuantity, productReason, productDiscount = 0;
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

$("#sessionsDateFrom").attr("max", today);

function getTotalPrice(){
	return parseFloat(productPrice * productQuantity * (1 + parseInt(productExtraCharge) / 100) * (1 - (productDiscount / 100))).toFixed(2);
}

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
	$("#sessionInfoTotalPrice").val(getTotalPrice());
});

$("#sessionInfoDiscount").change(() => {
	productDiscount = $("#sessionInfoDiscount").val();
	if(productPrice == NaN || productQuantity == NaN) return;
	$("#sessionInfoTotalPrice").val(getTotalPrice());	
})

$("#sessionInfoQuantity").change(() => {
	productQuantity = $("#sessionInfoQuantity").val();
	if(productPrice == NaN || productQuantity == NaN) return;
	$("#sessionInfoTotalPrice").val(getTotalPrice());
})

$("#createSessionButton").on("click", () => {
	let dateFrom = $("#createSessionDateFrom").val();
	// let dateTo = "01.01.2030";
	console.log(dateFrom);
	poolConnect.then((pool) => {
		pool.request()
				.input("begin_date", mssql.DateTime, dateFrom)
				.execute("dbo.retail_sale_create_new_session", (err, res) => {
					console.log("Session Create Error: \n", err, res);
					fillSessions(dateFrom, new Date());
					$(".sessionCreatePart").fadeOut(100);
					$("#createSessionPartButton").fadeOut(100);
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
	productDiscount = $("#sessionInfoDiscount").val();
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
				.input("barcode", mssql.BigInt, 45684645654358)
				.input("product_id", mssql.Int, productId)
				.input("reason", mssql.NVarChar(250), productReason)
				.input("document_id_as_parent", mssql.BigInt, productDocumentId)
				.input("product_manufacturer", mssql.Int, productManufacture)
				.input("retail_sale_session_id", mssql.Int, session_id)
				.input("left", mssql.Float, productLeft)
				.input("discount", mssql.SmallInt, productDiscount)
				.execute("dbo.retail_sale_info_insert", (err, res) => {
					console.log(err);

					$(".sessionsInfoNewInputs").fadeOut(100);
					$(".sessionsInfoSearch").fadeOut(100);
					fillSessionsInfo(session_id);
					
					setTimeout(() => {
						$(".sessionsPart").fadeIn(100);
						$(".sessionsInfoPart").fadeIn(100);
					}, 100)
					$("#acceptNewSessionInfo").fadeIn(0);
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
	// dateFrom = "20.07.2020";
	// dateTo = Date.now();
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
					$("#sessions").empty();
					console.log(data);
					//todo TABLE HEADER
					let headLi          = document.createElement("li");
					headLi.className 	 += "title";
					let headDiv         = document.createElement("div")
					headDiv.className   = "inventoryItemContainer";
					headDiv.style.width = "100%";					

					let head_BeginDate           = document.createElement("p");
					head_BeginDate.innerHTML     = "Begin Date";
					head_BeginDate.style.padding = "12px 16px"
					
					let head_CostPrice           = document.createElement("p");
					head_CostPrice.innerHTML     = "Cost Price";
					head_CostPrice.style.padding = "12px 16px";
					
					let head_DefaultCurrency           = document.createElement("p");
					head_DefaultCurrency.innerHTML     = "Default Currency";  
					head_DefaultCurrency.style.padding = "12px 16px";
					
					let head_IsDone           = document.createElement("p");
					head_IsDone.innerHTML     = "Is Done";
					head_IsDone.style.padding = "12px 16px";
				
					let head_WholePrice           = document.createElement("p");
					head_WholePrice.innerHTML 	  = "Whole Price"
					head_WholePrice.style.padding	= "12px 16px";
					
					headDiv.appendChild(head_BeginDate);
					headDiv.appendChild(head_CostPrice);
					headDiv.appendChild(head_DefaultCurrency);
					headDiv.appendChild(head_IsDone);
					headDiv.appendChild(head_WholePrice);
					headLi.appendChild(headDiv);
					document.getElementById('sessions').appendChild(headLi)
					
					//todo TABLE BODY
					data.forEach((element) => {
						
						let li = document.createElement("li");
						li.style.opacity = '1';
						let titleDiv = document.createElement("div");
						titleDiv.className   = "inventoryItemContainer";
						titleDiv.style.width = "100%";
						
						let sessionId = element.id;

						let sessionBegin = document.createElement('p')
						sessionBegin.textContent = moment(element.begin_date).format("DD/MM/YYYY")

						let sessionCost = document.createElement('p')
						sessionCost.textContent = element.cost_price == null ? 'Empty' : element.cost_price.toFixed(2);

						let sessionDefaultCurrency = document.createElement('p')
						sessionDefaultCurrency.textContent = element.default_currency

						let sessionIsDone = document.createElement('p')
						sessionIsDone.textContent = element.is_done

						let sessionWholePrice = document.createElement('p')
						sessionWholePrice.textContent = element.whole_price == null ? 'Empty' : element.whole_price.toFixed(2);

					
						titleDiv.appendChild(sessionBegin);
						titleDiv.appendChild(sessionCost);
						titleDiv.appendChild(sessionDefaultCurrency);
						titleDiv.appendChild(sessionIsDone);
						titleDiv.appendChild(sessionWholePrice);
						li.appendChild(titleDiv);
						li.onclick = function(){
							$("li").removeClass("checked");
							li.className += "checked";
							console.log(sessionId);
							session_id = sessionId;
							fillSessionsInfo(sessionId);
						}
						document.getElementById("sessions").appendChild(li);
					})
				})
	})
}


function fillSessionsInfo(sessionId){
	poolConnect.then((pool) => {
		pool.request()
				.input("retail_sale_session_id", mssql.Int, sessionId)
				.execute("dbo.retail_sale_session_info", (err, res) => {
					data = [];
					for(let i of res.recordset){
						data.push(i);
					}
					console.log(data);
					$("#sessionsInfo").empty();
					let headLi          =  document.createElement("li");
					headLi.className 		+= "title";
					let headDiv         =  document.createElement("div")
					headDiv.className   =  "inventoryItemContainer";
					headDiv.style.width =  "100%";					

					let head_ProductTitle = document.createElement('p');
					head_ProductTitle.textContent = 'Product Title'

					let head_ExpiryDate = document.createElement('p');
					head_ExpiryDate.textContent = "Expiry Date";
					
					let head_Quantity = document.createElement('p');
					head_Quantity.textContent = 'Quantity';

					let head_ProductUnit = document.createElement('p');
					head_ProductUnit.textContent = "Product Unit";

					let head_PriceForOne = document.createElement('p');
					head_PriceForOne.textContent = "Price For One";

					let head_ExtraCharge = document.createElement('p');
					head_ExtraCharge.textContent = "Extra Charge";

					let head_ForSalePrice = document.createElement('p');
					head_ForSalePrice.textContent = "For Sale Price";

					let head_FullPrice = document.createElement('p');
					head_FullPrice.textContent = "Full Price";

					let head_Currency = document.createElement('p');
					head_Currency.textContent = "Currency";

					let head_Reason = document.createElement('p');
					head_Reason.textContent = "Reason";

					headDiv.appendChild(head_ProductTitle);
					headDiv.appendChild(head_ExpiryDate);
					headDiv.appendChild(head_Quantity);
					headDiv.appendChild(head_ProductUnit);
					headDiv.appendChild(head_PriceForOne);
					headDiv.appendChild(head_ExtraCharge);
					headDiv.appendChild(head_ForSalePrice);
					headDiv.appendChild(head_FullPrice);
					headDiv.appendChild(head_Currency);
					headDiv.appendChild(head_Reason);

					headLi.appendChild(headDiv);
					document.getElementById("sessionsInfo").appendChild(headLi);
					data.forEach((element) => {
						let li = document.createElement('li');
						let div = document.createElement("div");
						div.className   = "inventoryItemContainer";
						div.style.width = "100%";
						
						let productTitle = document.createElement("p");
						productTitle.innerHTML = element['product_title'];

						let expiryDate = document.createElement('p');
						expiryDate.innerHTML = moment(element['exp_date']).format('DD/MM/YYYY');

						let quantity = document.createElement('p');
						quantity.innerHTML = element['quantity'];

						let productUnit = document.createElement('p');
						productUnit.innerHTML = element['unit_title'];

						let priceForOne = document.createElement('p');
						priceForOne.innerHTML = element['pricefor1'];

						let extraCharge = document.createElement('p');
						extraCharge.innerHTML = element['extra_charge'];

						let forSalePrice = document.createElement('p');
						forSalePrice.innerHTML = element['for_sale_price'].toFixed(2);

						let fullPrice = document.createElement('p');
						fullPrice.innerHTML = element['sum_price'].toFixed(2);

						let currency = document.createElement('p');
						currency.innerHTML = element['currency_title'];

						let reason = document.createElement('p');
						reason.innerHTML = element['reason'];
						
						div.appendChild(productTitle);
						div.appendChild(expiryDate);
						div.appendChild(quantity);
						div.appendChild(productUnit);
						div.appendChild(priceForOne);
						div.appendChild(priceForOne);
						div.appendChild(extraCharge);
						div.appendChild(forSalePrice);
						div.appendChild(fullPrice);
						div.appendChild(currency);
						div.appendChild(reason);

						li.appendChild(div);
						document.getElementById("sessionsInfo").appendChild(li);
					});
					$(".sessionInfoList").fadeIn(100);
					// $("#acceptNewSessionInfo").fadeOut(0)
					$(".addNewSessionInfo").fadeIn(100);
					$(".addNewSessionInfo").css("display", 'flex');
				});
	})
}

function fillSessionSearch(value){
	let parameterName = "";
	let parameterType = "";
	
	if(!isNaN(value)){
		parameterName = "product_id";
		parameterType = mssql.Int;
	}
	else{
		parameterName = "title";
		parameterType = mssql.NVarChar(250);
	}
	poolConnect.then((pool) => {
		console.log(parameterName);
		pool.request()
				.input(parameterName, parameterType, value)
				.execute("dbo.retail_sale_search", (err, res) => {
					if(err){
						console.log(err);
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
												<div class="sessionSearchHeaderItem">Unit</div>
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
													<div class="sessionSearchTableData" id="productunit">${i.unit_title}</div>
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
								let total_price = (getTotalPrice());
								$("#sessionInfoTotalPrice").val(total_price);
							}
						})
					})
				})
	})
}