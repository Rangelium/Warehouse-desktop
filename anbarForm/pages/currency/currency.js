var currencySelectedId = "";

function fillTable(){
	poolConnect.then((pool) => {
		pool.request().execute("dbo.currency_select_full", (err, res) => {
			data = []
			for(let i of res.recordset){
				data.push(i);
			}
			$(".currencyProductTable").remove();
						
			$(".currency-table-data").append("<table class='currencyProductTable'></table>");
			$(".currencyProductTable").append("<thead></thead>");
			$(".currencyProductTable").append("<tbody></tbody>");
	
			$(".currencyProductTable > thead").append(`<th>Full Title:</th>`);
			$(".currencyProductTable > thead").append(`<th>Title:</th>`);
			
			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="currencyId">${el.id}</td>`
				row += `<td>${el.full_title}</td>`;
				row += `<td>${el.title}</td>`;
				row += "</tr>";
				$(".currencyProductTable > tbody").append(row);
			});
			$(".currencyProductInfo").css("opacity", "1");
			$(".currencyProductInfo").css("pointer-events", "unset");
			let tr = document.querySelectorAll("tbody tr");
			tr.forEach((el) => {
				el.addEventListener("click", () => {
					tr.forEach((trel) => {trel.classList.remove("selected")});
					el.classList.toggle("selected");
					currencySelectedId = el.children.item(2).textContent;
				})
			})
		});
	});
}

fillTable();

$(".currencyInputButton").on("click", () => {
	let full_title = $("input#full_title").val();
	let title = $("input#title").val();

	if(full_title.length == 0 || title.length == 0){
		alert("Please fill all the fields");
		return;
	}
	poolConnect.then((pool) => {
		pool.request()
				.input("full_title", mssql.NVarChar(250), full_title)
				.input("title", mssql.NVarChar(250), title)
				.input("user_id", mssql.Int, USER["id"])
				.execute("dbo.currency_insert", (err, res) => {
					$("input").val("");
					fillTable();
				});
	})
})

$(".currencyDeleteButton").on("click", () => {
	if(currencySelectedId.length == 0){
		alert("Nothing selected");
		return;
	}
	poolConnect.then((pool) => {
		pool.request()
				.input("title", mssql.NVarChar(250), currencySelectedId)
				.input("user_id", mssql.Int, USER["id"])
				.execute("dbo.currency_delete", (err, res) => {
					fillTable();
				})
	})
})