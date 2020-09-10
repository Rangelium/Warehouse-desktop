// ======================================================================================================
//                                             UTIL FUNCTIONS

// ======================================================================================================
async function showAlert(message) {
	$("#alertMessage").html(message);
	$(".cstmAlertBox").css({
		display: "flex",
		opacity: "1",
		width: "30%",
		height: "30%",
	});
	$(".cstmAlertBox").attr("data-active", "true");

	$(".blur").css({ "z-index": "100000" });

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
	$(".cstmAlertBox").attr("data-active", "false");
	$(".blur").css({ "z-index": "-1" });
	setTimeout(() => {
		$(".cstmAlertBox").css("display", "none");
	}, 600);
}

// ====================================================================================================
//                                        Page's main part logic
// ====================================================================================================
var productsData;
var globalCardCounter = 0;
function fillTable(data) {
	$("#dataTable").empty();

	$("#dataTable").append("<thead></thead>");
	$("#dataTable").append("<tbody></tbody>");

	$("#dataTable > thead").append(`<th>${languages["product_name"]}:</th>`);
	$("#dataTable > thead").append(`<th>${languages["existing_quantity"]}:</th>`);
	$("#dataTable > thead").append(`<th>${languages["necessary_quantity"]}:</th>`);
	$("#dataTable > thead").append(`<th>${languages["optimal_quantity"]}:</th>`);
	$("#dataTable > thead").append(`<th>${languages["unit"]}:</th>`);
	$("#dataTable > thead").append(`<th>${languages["status"]}:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-product" data-id='${el.product_id}'>`;

		let status;
		switch (el.is_confirmed) {
			case null:
				status = "------";
				break;
			case -1:
				status = languages["order_refused"];
				break;
			case 0:
				status = languages["order_processing"];
				break;
			case 1:
				status = languages["order_accepted"];
				break;
			case 2:
				status = languages["order_updated"];
				break;
		}

		row += `<td>${el.title}</td>`;
		row += `<td>${el.existing_quantity}</td>`;
		row += `<td>${el.quantity_necessary}</td>`;
		row += `<td>${el.optimal_quantity}</td>`;
		row += `<td>${el.unit_title}</td>`;
		row += `<td>${status}</td>`;

		$("#dataTable > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 14) {
		for (let i = 0; i < 14 - data.length; i++) {
			let row = "<tr class='empty-single-product' style='height: 40px'>";

			for (let j = 0; j < 6; j++) {
				row += "<td></td>";
			}
			row += "</tr>";

			$("#dataTable > tbody").append(row);
		}
	}

	$(".single-product").click(function () {
		productsData.forEach((el) => {
			if (el.product_id === $(this).attr("data-id")) {
				globalCardCounter++;
				addProductCard(el);
				return;
			}
		});
	});
}
function getData() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.products_amount_info", (err, res) => {
			if (err !== null) console.log(err);
			productsData = res.recordset;
			fillTable(res.recordset);
		});
	});
}

function addProductCard(productData) {
	let card = $(
		`<div class="productCard" data-unitId="${productData.unit_id}" data-productId="${productData.product_id}" data-title="${productData.title}" data-parentId="${productData.parent_id}"></div>`
	);
	let data = $(
		`<div class="row">
      <h2>${productData.title}</h2>
    </div>
    <div class="row">
      <div class="block">
        <p>Optimal:<span id="card_optQuality">${productData.optimal_quantity}<span></p>
				<p>Minumum:<span id="card_minQuality">${productData.min_quantity}<span></p>
				<p>${languages["left_quantity"]}:<span id="card_left">${productData.existing_quantity}<span></p>
        <p>Necessary:<span id="card_required">${productData.quantity_necessary}<span></p>
      </div>
			<div class="block special">
				<p>Importance:</p>
				<div class="radioContainer">
					<label class="radioBtn">Not Important
						<input type="radio" class="importance" value="0" name="importance${globalCardCounter}" checked/>
						<span class="checkmark"></span>
					</label>
					<label class="radioBtn">Important
						<input type="radio" class="importance" value="1" name="importance${globalCardCounter}"/>
						<span class="checkmark"></span>
					</label>
					<label class="radioBtn">Very Important
						<input type="radio" class="importance" value="2" name="importance${globalCardCounter}"/>
						<span class="checkmark"></span>
					</label>
				</div>
      </div>
		</div>
    <div class="row">
      <p>${languages["order_amount"]}:</p>
      <input placeholder="${languages["order_amount"]}" id="card_orderAmount" required type="number" />
    </div>
    <div class="row">
      <textarea placeholder="${languages["comment_textarea"]}" id="card_comment"></textarea>
    </div>`
	);
	let deleteBtn = $(`<img src="../stylesGlobal/imgs/delete_btn.svg" />`);
	deleteBtn.click(function () {
		$(this).parent().detach();
		globalCardCounter--;
	});

	card.append(deleteBtn);
	card.append(data);
	card.find("#card_orderAmount").val(productData.quantity_necessary);
	$(".cardsContainer").append(card);
}

$("#deleteAllBtn").click(() => {
	$(".cardsContainer").empty();
	globalCardCounter = 0;
});

$("#sendRequestBtn").click(function () {
	showAlert("Are you sure you wnat to order this products?").then((res) => {
		if (res) {
			if (
				Array.from($(".productCard")).some(
					(card) => $(card).find("input").val().trim() === ""
				)
			) {
				return;
			}

			var mats = [];
			Array.from($(".productCard")).forEach((card) => {
				let importance;
				Array.from($(card).find(".importance")).forEach((el) => {
					if (el.checked) importance = parseInt($(el).attr("value"));
				});

				mats.push([
					parseInt($(card).attr("data-parentId")),
					parseInt($(card).find("#card_orderAmount").val()),
					$(card).find("textarea").val(),
					$(card).attr("data-title"),
					importance,
					parseInt($(card).attr("data-unitId")),
				]);
			});

			const data = {
				deadline: "",
				mats: mats,
				receivers: [],
				comment: "",
				assignment: "",
				ordNumb: "",
				review: "",
				empid: USER.id,
			};

			fetch("http://172.16.3.101:54321/api/new-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": JSON.stringify(data).length,
				},
				body: JSON.stringify(data),
			})
				.then((resp) => resp.json())
				.then((respJ) => {
					if (respJ[0].result === "success") {
						showSuccess();
						handleResult(respJ[0]);
					}
				});
		}
		closeAlert();
	});
});
function handleResult(data) {
	console.log(data);
	Array.from($(".productCard")).forEach((card) => {
		console.log(data.id);
		console.log(parseInt($(card).attr("data-productId")));
		poolConnect.then((pool) => {
			pool
				.request()
				.input("id", data.id)
				.input("product_id", parseInt($(card).attr("data-productId")))
				.execute("anbar.order_list_insert", (err) => {
					if (err !== null) console.log(err);
				});
		});
	});
}

function showSuccess() {
	setTimeout(() => {
		// show container
		$(".successContainer").css({
			"z-index": "1000000000000",
			opacity: "1",
		});
		// Start animation
		$("#successAnimation").attr("class", "animated");

		// Clear card container
		setTimeout(() => {
			$(".cardsContainer").empty();
			globalCardCounter = 0;
			getData();
		}, 300);

		setTimeout(() => {
			// start hiding container
			$(".successContainer").css({
				"z-index": "-10",
				opacity: "0",
			});

			// Reset animation
			setTimeout(() => {
				$("#successAnimation").attr("class", "");
			}, 400);
		}, 1800);
	}, 200);
}

setInterval(() => {
	if ($(".cstmAlertBox").attr("data-active") === "true") {
		$(".upperBlock").attr("data-active", "true");
	}
	if ($(".productAuth-container").attr("data-active") === "false") {
		$(".upperBlock").attr("data-active", "false");
	}
	if (Array.from($(".productCard")).length > 0) {
		$(".productAuth-container").attr("data-active", "true");
		showLowerData();
	} else {
		$(".productAuth-container").attr("data-active", "false");
		hideLowerData();
	}
}, 300);
function showLowerData() {
	$(".lowerBlock").attr("class", "block lowerBlock active");
	$("#init").css("opacity", "0");
	$(".utils").css({ "pointer-events": "all", visibility: "visible" });
	$(".upperBlock").css({
		height: "60%",
	});

	$(".lowerBlock").mouseenter(() => {
		if ($(".productAuth-container").attr("data-active") === "true") {
			if ($(".upperBlock").attr("data-active") === "false") {
				$(".upperBlock").attr("data-active", "true");
			}
		}
	});
	$(".lowerBlock").mouseleave(() => {
		if ($(".productAuth-container").attr("data-active") === "true") {
			if ($(".upperBlock").attr("data-active") === "true") {
				$(".upperBlock").attr("data-active", "false");
			}
		}
	});
}
function hideLowerData() {
	$(".lowerBlock").attr("class", "block lowerBlock");
	$("#init").css("opacity", "1");
	$(".utils").css({ "pointer-events": "none", visibility: "hidden" });
	$(".upperBlock").css({
		height: "80%",
	});
}

// On load
$(".utils").css({ "pointer-events": "none", visibility: "hidden" });
$(".upperBlock").attr("data-active", "false");
getData();

setInterval(() => {
	console.log("refreshed");
	getData();
}, 20000);
