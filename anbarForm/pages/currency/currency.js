var currencySelectedId = "";
var restoreId = -1;


function fillDeletedTable(){
	const table_name = "anbar.currency";
	poolConnect.then((pool) => {
		pool.request()
				.input("table_name", mssql.NVarChar(250), table_name)
				.execute("anbar.return_all_deleted_from_table", (err, res) =>{
					// if(err != null){
					// 	console.log(err);
					// 	return;
					// }
					// console.log(res);
					data = [];
					for (let i of res.recordset) {
						data.push(i);
					}
					$("#restoreTable").remove();

					$("#restoreTableData").append(
						"<table class='currencyProductTable' id='restoreTable'></table>"
					);
					$("#restoreTable").append("<thead></thead>");
					$("#restoreTable").append("<tbody></tbody>");

					$("#restoreTable > thead").append(
						`<th>${languages["title"]}:</th>`
					);
					$("#restoreTable > thead").append(
						`<th>${languages["abbreviation"]}:</th>`
					);
					$("#restoreInfo").css("opacity", "1");
					$("#restoreInfo").css("pointer-events", "unset");

					data.forEach((el) => {
						let row = `<tr>`;
						row += `<td style="display:none" id="restoreId">${el.restore_id}</td>`;
						row += `<td>${el.full_title}</td>`;
						row += `<td>${el.title}</td>`;
						row += "</tr>";
						$("#restoreTable > tbody").append(row);
					});

					$("#restoreTable tbody tr").mousedown(function(e){
						if(e.button == 2){
							$("#restoreTable tbody tr").removeClass("selected");
							$(this).addClass("selected");
							restoreId = this.firstChild.textContent;
							let x = e.pageX;
							let y = e.pageY;
							let optionCard = $("#deletedCard");
							optionCard.css({
								left: x,
								top: y,
								display: "flex"
							});
							return false;
						}
						return true;
					})
				})
	})
}

function fillTable() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.currency_select", (err, res) => {
			console.log(err);
			data = [];
			for (let i of res.recordset) {
				data.push(i);
			}
			$("#currencyTable").remove();

			$("#currencyTableData").append(
				"<table class='currencyProductTable' id='currencyTable'></table>"
			);
			$("#currencyTable").append("<thead></thead>");
			$("#currencyTable").append("<tbody></tbody>");

			$("#currencyTable > thead").append(
				`<th>${languages["title"]}:</th>`
			);
			$("#currencyTable > thead").append(
				`<th>${languages["abbreviation"]}:</th>`
			);

			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="currencyId">${el.id}</td>`;
				row += `<td>${el.full_title}</td>`;
				row += `<td>${el.title}</td>`;
				row += "</tr>";
				$("#currencyTable > tbody").append(row);
			});
			console.log("lol");
			$("#currencyInfo").css("opacity", "1");
			$("#currencyInfo").css("pointer-events", "unset");
			// let tr = document.querySelectorAll("#currencyTable tbody tr");
			// tr.forEach((el) => {
			// 	el.addEventListener("click", () => {
			// 		tr.forEach((trel) => {
			// 			trel.classList.remove("selected");
			// 		});
			// 		el.classList.toggle("selected");
			// 		currencySelectedId = el.children.item(2).textContent;
			// 	});
			// });
			$("#currencyTable tbody tr").mousedown(function(e){
				console.log("button click")
				if(e.button == 2){
					$("#currencyTable tbody tr").removeClass("selected");
					$(this).addClass("selected");
					currencySelectedId = this.children.item(2).textContent;
					let x = e.pageX;
					let y = e.pageY;
					let optionCard = $("#mainCard");
					optionCard.css({
						left: x,
						top: y,
						display: "flex"
					});
					return false;
				}
				return true;
			})
		});
	});
}

fillTable();

$("#addButton").on("click", () => {
	let full_title = $("input#full_title").val();
	let title = $("input#title").val();

	if (full_title.length == 0 || title.length == 0) {
		alert("Please fill all the fields");
		return;
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("full_title", mssql.NVarChar(250), full_title)
			.input("title", mssql.NVarChar(250), title)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.currency_insert", (err, res) => {
				$("input").val("");
				fillTable();
			});
	});
});

$("p#deleteButton").click(() => {
	if (currencySelectedId.length == 0) {
		alert("Nothing selected");
		return;
	}

	// console.log("delete click")
	console.log(currencySelectedId);
	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", mssql.NVarChar(250), currencySelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.currency_delete", (err, res) => {
				console.log(err);
				fillTable();
			});
	});
});

$("#restoreButton").click(function(){
	if($(this).attr("data-state") == "restore"){
		fillDeletedTable();
		$(this).text("Currency");
		$("#mainContainer").fadeOut(100);
		$("#returnContainer").fadeIn(100);
		$(this).attr("data-state", "currency");
	}
	else{
		fillTable();
		$(this).text("Restore");
		$("#returnContainer").fadeOut(100);
		$("#mainContainer").fadeIn(100);
		$(this).attr("data-state", "restore");
	}
})

$(".optionsCard .optionsElement#returnElement").click(function(){
	$(".optionsCard").fadeOut(100);
	if(restoreId >= 0)
	poolConnect.then((pool) => {
		pool.request()
				.input("restore_id", mssql.Int, restoreId)
				.execute("anbar.return_deleted", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					fillDeletedTable();
					fillTable();
				})
	})
})

$(document).click(() => {
	$(".optionsCard").fadeOut(20);
	$("#restoreTable tbody tr").removeClass("selected");
})