// Require Jquery

class MyTreeView {
	constructor(arr) {
		this.primordialArr = arr;
		this.data = this.convertData(arr);
	}

	convertData(arr) {
		let data = [];

		for (let i = 0; i < arr.length; i++) {
			arr[i].children = [];
			this.addToData(arr[i], data);
		}

		return data;
	}

	addToData(element, data) {
		if (element.parent_id === 0) {
			data.push(element);
			return;
		}
		for (let i = 0; i < data.length; i++) {
			if (element.parent_id == data[i].id) {
				data[i].children.push(element);
			}
			this.addToData(element, data[i].children);
		}
		return;
	}

	showTree(elClass) {
		// Create main root for treeView
		$(".treeView").remove();
		$(`.${elClass}`).append(`<ul class="treeView" data-isExpanded="true"></ul>`);

		for (let i = 0; i < this.data.length; i++) {
			this.show(this.data[i], $("ul.treeView"));
		}
	}

	show(element, path) {
		if (element.children.length !== 0 || element.product_id == null) {
			path.append(
				`<li class="tv-cont"><span data-isExpanded="true" data-id=${element.id}><p class="tv-groupname">:${element.title}</p></span><ul class="tv-groupNodes" data-id=${element.id} data-parentId="${element.parent_id}" data-isExpanded="true" ></ul></li>`
			);

			for (let i = 0; i < element.children.length; i++) {
				this.show(element.children[i], $(`.tv-groupNodes[data-id=${element.id}]`)); //
			}
		} else {
			$(path).append(
				`<li class="tv-product"><p data-id="${element.id}" class="tv-name" data-isSelected="false">${element.title}<p><li>`
			); //
		}
	}

	giveDataOfElement(element) {
		let el_id = parseInt(element.attr("data-id"), 10);
		for (let i = 0; i < this.primordialArr.length; i++) {
			if (el_id === this.primordialArr[i].id) {
				return this.primordialArr[i];
			}
		}
	}
}

exports.MyTreeView = MyTreeView;
