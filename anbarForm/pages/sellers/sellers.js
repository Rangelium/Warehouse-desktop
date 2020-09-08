var sellersSelectedId = -1;
var procedures = [
	"anbar.product_seller_select_active",
	"anbar.product_seller_select_deactive",
];
var procedureId = 0;

function fillTable(procedureId) {
	poolConnect.then((pool) => {
		pool.request().execute(procedures[procedureId], (err, res) => {
			data = [];
			for (let i of res.recordset) {
				data.push(i);
				console.log(i);
			}
			$(".sellersProductTable").remove();

			// let head = ["Title", "Firstname", "Lastname", "Patronymic", "Active", "P Address", "Phone Number"];
			$(".sellers-table-data").append(
				"<table class='sellersProductTable'></table>"
			);
			$(".sellersProductTable").append("<thead></thead>");
			$(".sellersProductTable").append("<tbody></tbody>");

			$(".sellersProductTable > thead").append(
				`<th>${languages["seller"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["firstname"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["secondname"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["patronymic"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["status"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["address"]}:</th>`
			);
			$(".sellersProductTable > thead").append(
				`<th>${languages["phonenumber"]}:</th>`
			);

			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="sellersId">${el.id}</td>`;
				row += `<td>${el.seller}</td>`;
				row += `<td>${el.firstname}</td>`;
				row += `<td>${el.lastname}</td>`;
				row += `<td>${el.patronymic}</td>`;
				row += `<td>${el.active == 1 ? "Yes" : "No"}</td>`;
				row += `<td>${el.p_address}</td>`;
				row += `<td>${el.phonenumber}</td>`;

				row += "</tr>";
				$(".sellersProductTable > tbody").append(row);
			});
			$(".sellersProductInfo").css("opacity", "1");
			$(".sellersProductInfo").css("pointer-events", "unset");
			let tr = document.querySelectorAll("tbody tr");
			tr.forEach((el) => {
				el.addEventListener("click", () => {
					tr.forEach((trel) => {
						trel.classList.remove("selected");
					});
					el.classList.toggle("selected");
					sellersSelectedId = el.firstChild.textContent;
				});
			});
		});
	});
}

fillTable(procedureId);

$(".sellersInputButton").click(() => {
	$("#createSeller").show();
});

$(".sellersPopupCloseButton").click(() => {
	$("#createSeller").hide();
});

$(".addSellersButton").on("click", () => {
	let title = $("input#title").val();
	let firstname = $("input#firstname").val();
	let lastname = $("input#lastname").val();
	let patronymic = $("input#patronymic").val();
	let phoneNumber = $("input#phonenumber").val();
	let p_address = $("input#paddress").val();
	let active = $("input#active").val() == "1" ? 1 : 0;
	if (
		title.length == 0 ||
		firstname.length == 0 ||
		lastname.length == 0 ||
		patronymic.length == 0 ||
		p_address.length == 0
	) {
		alert("All fields must be filled");
		return;
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("seller", mssql.NVarChar(250), title)
			.input("firstname", mssql.NVarChar(250), firstname)
			.input("lastname", mssql.NVarChar(250), lastname)
			.input("patronymic", mssql.NVarChar(250), patronymic)
			.input("user_id", mssql.Int, USER["id"])
			.input("active", mssql.Int, active)
			.input("phonenumber", mssql.NVarChar(250), phoneNumber)
			.input("p_address", mssql.NVarChar(250), p_address)
			.execute("anbar.product_sellers_insert", (err, res) => {
				$("input").val("");
				$("#active").prop("checked", false);
				console.log(err);
				fillTable(procedureId);
			});
	});
});

$("#sellerDelete").on("click", () => {
	if (!sellersSelectedId) {
		alert("Please select row.");
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, sellersSelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.product_sellers_delete", (err, res) => {
				console.log(err);
				fillTable(procedureId);
			});
	});
});

$("#showContent").on("click", () => {
	if (procedureId == 0) {
		procedureId = 1;
		$("#showContent").text("Aktiv olan satıcıları göstər");
	} else {
		procedureId = 0;
		$("#showContent").text("Aktiv olmayan satıcıları göstər");
	}
	fillTable(procedureId);
});

$("#changeStatus").on("click", () => {
	if (!sellersSelectedId) alert("Please select a row");
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, sellersSelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.product_sellers_deactivate_or_activate", (err, res) => {
				console.log(err);
				fillTable(procedureId);
				sellersSelectedId = null;
			});
	});
});
