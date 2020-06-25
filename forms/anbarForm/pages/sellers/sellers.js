var sellersSelectedId = -1;


function fillTable(){
	poolConnect.then((pool) => {
		pool.request().execute("dbo.product_sellers_select", (err, res) => {
			data = []
			for(let i of res.recordset){
				data.push(i);
			}
			$(".sellersProductTable").remove();
						
			// let head = ["Title", "Firstname", "Lastname", "Patronymic", "Active", "P Address", "Phone Number"];
			$(".sellers-table-data").append("<table class='sellersProductTable'></table>");
			$(".sellersProductTable").append("<thead></thead>");
			$(".sellersProductTable").append("<tbody></tbody>");
	
			$(".sellersProductTable > thead").append(`<th>Title:</th>`);
			$(".sellersProductTable > thead").append(`<th>Firstname:</th>`);
			$(".sellersProductTable > thead").append(`<th>Lastname:</th>`);
			$(".sellersProductTable > thead").append(`<th>Patronymic:</th>`);
			$(".sellersProductTable > thead").append(`<th>Active:</th>`);
			$(".sellersProductTable > thead").append(`<th>P Address:</th>`);
			$(".sellersProductTable > thead").append(`<th>Phone Number:</th>`);
			
			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="sellersId">${el.id}</td>`
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
					tr.forEach((trel) => {trel.classList.remove("selected")});
					el.classList.toggle("selected");
					selectedId = el.firstChild.textContent;
				})
			})
		});
	});
}

fillTable();

$(".sellersInputButton").click(() => {
	$(".sellersPopUpContainer").show();
});

$(".sellersPopupCloseButton").click(() => {
	$(".sellersPopUpContainer").hide();
})

$(".addSellersButton").on("click", () => {
	let title = $("input#title").val();
	let firstname = $("input#firstname").val();
	let lastname = $("input#lastname").val();
	let patronymic = $("input#patronymic").val();
	let phoneNumber = $("input#phonenumber").val();
	let p_address = $("input#paddress").val();
	let active = $("input#active").val() == '1' ? 1 : 0;
	if(title.length == 0 || firstname.length == 0
		|| lastname.length == 0 || patronymic.length == 0
    || p_address.length == 0){
			alert("All fields must be filled");
			return
	}
	poolConnect.then((pool) => {
		pool.request()
				.input("title", mssql.NVarChar(250), title)
				.input("firstname", mssql.NVarChar(250), firstname)
				.input("lastname", mssql.NVarChar(250), lastname)
				.input("patronymic", mssql.NVarChar(250), patronymic)
				.input("user_id", mssql.Int, USER["id"])
				.input("active", mssql.Int, active)
				.input("phonenumber", mssql.NVarChar(250), phoneNumber)
				.input("p_address", mssql.NVarChar(250), p_address)
				.execute("dbo.product_sellers_insert", (err, res)=>{
					$("input").val("");
					console.log("Successfully inserted");
				})
	})
});

$(".sellersDeleteButton").on("click", () => {
	console.log(selectedId);
})