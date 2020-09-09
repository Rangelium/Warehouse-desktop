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

// ====================================================================================================
//                                        Page's main part logic
// ====================================================================================================
var productsData;
function fillTable(data) {
	console.log(data);
	$("#dataTable").empty();

	$("#dataTable").append("<thead></thead>");
	$("#dataTable").append("<tbody></tbody>");

	$("#dataTable > thead").append(`<th>${languages['product_name']}:</th>`);
	$("#dataTable > thead").append(`<th>${languages['existing_quantity']}:</th>`);
	$("#dataTable > thead").append(`<th>${languages['necessary_quantity']}:</th>`);
	$("#dataTable > thead").append(`<th>${languages['optimal_quantity']}:</th>`);
	$("#dataTable > thead").append(`<th>${languages['unit']}:</th>`);
	$("#dataTable > thead").append(`<th>${languages['status']}:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-product" data-id='${el.product_id}'>`;

		let status;
		switch (el.is_confirmed) {
			case null:
				status = languages['order_processing'];
				break;
			case 0:
				status = languages['order_refused'];
				break;
			case 1:
				status = languages['order_accepted'];
				break;
			case 2:
				status = languages['order_updated'];
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
	if (data.length < 15) {
		for (let i = 0; i < 15 - data.length; i++) {
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
	let card = $(`<div class="productCard"></div>`);
	let data = $(
		`<div class="row">
      <h2>${productData.title}</h2>
    </div>
    <div class="row">
      <div class="block">
        <p>${languages['optimal_quantity']}:<span id="card_optQuality">${productData.optimal_quantity}<span></p>
        <p>${languages['minimum_quantity']}:<span id="card_minQuality">${productData.min_quantity}<span></p>
      </div>
      <div class="block">
        <p>${languages['left_quantity']}:<span id="card_left">${productData.min_quantity}<span></p>
        <p>${languages['necessary_quantity']}:<span id="card_required">${productData.quantity_necessary}<span></p>
      </div>
    </div>
    <div class="row">
      <p>${languages['order_amount']}:</p>
      <input placeholder="${languages['order_amount']}" id="card_orderAmount" required type="number" />
    </div>
    <div class="row">
      <textarea placeholder="${languages['comment_textarea']}" id="card_comment"></textarea>
    </div>`
	);
	let deleteBtn = $(`<img src="../stylesGlobal/imgs/delete_btn.svg" />`);
	deleteBtn.click(function () {
		$(this).parent().detach();
	});

	card.append(deleteBtn);
	card.append(data);
	$(".cardsContainer").append(card);
}

$("#deleteAllBtn").click(() => {
	$(".cardsContainer").empty();
});
$("#sendRequestBtn").click(function () {
	if (
		Array.from($(".productCard")).some(
			(card) => $(card).find("input").val().trim() === ""
		)
	)
		return;

	console.log("coming soon...");
});

setInterval(() => {
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
