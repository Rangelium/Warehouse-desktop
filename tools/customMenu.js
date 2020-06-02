const electron = require("electron");
const path = require("path");

const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = electron;

// This is my custom Menu for Navigation
// API will come soon i hope

class MyCustomMenu {
	constructor() {
		this.menuItems = [];
		this.id = 0;
	}

	// Security issue
	// here i do not check if elements in submenu do not containt click event
	// so thete will be erorr, you can fix it if you are simp.
	addItems(itemsArr) {
		for (let i = 0; i < itemsArr.length; i++) {
			if (itemsArr[i].click !== undefined) {
				itemsArr[i].id = this.id++;
				this.menuItems.push(itemsArr[i]);
			} else if (itemsArr[i].submenu !== undefined && itemsArr[i].shortcut == undefined) {
				itemsArr[i].id = this.id++;
				for (let j = 0; j < itemsArr[i].submenu.length; j++) {
					itemsArr[i].submenu[j].id = this.id++;
				}
				this.menuItems.push(itemsArr[i]);
			}
		}
	}

	clearAllItems() {
		this.menuItems = [];
	}

	removeAt(index) {
		this.menuItems.splice(index, 1);
	}

	setSettings(obj) {
		if (obj.click == undefined && obj.shortcut == undefined && obj.submenu.length > 0) {
			obj.role = "settings";
			obj.id = this.id++;
			for (let i = 0; i < obj.submenu.length; i++) {
				obj.submenu[i].id = this.id++;
			}
			this.menuItems.push(obj);
		}
	}

	// TO BE DONE!!!
	checkShortCutValidity(shortcut) {
		return true;
	}

	renderMenu() {
		if (this.menuItems.length == 0) {
			return;
		}

		// Unregister all shortcuts
		globalShortcut.unregisterAll();

		// Send all data to render
		BrowserWindow.getAllWindows()[0].webContents.send(
			"createNavBar",
			JSON.stringify(this.menuItems)
		);

		// Handling cliks
		ipcMain.on("navBarClicks", (e, itemId) => {
			for (let i = 0; i < this.menuItems.length; i++) {
				if (this.menuItems[i].submenu !== undefined) {
					for (let j = 0; j < this.menuItems[i].submenu.length; j++) {
						if (itemId == this.menuItems[i].submenu[j].id) {
							try {
								this.menuItems[i].submenu[j].click();
							} catch (error) {
								console.log("There is not corresponding function for this submenu item!");
							}
						}
					}
				}
				if (itemId == this.menuItems[i].id) {
					this.menuItems[i].click();
				}
			}
		});

		// Setting shortcuts
		app.whenReady().then(() => {
			for (let i = 0; i < this.menuItems.length; i++) {
				if (this.menuItems[i].submenu !== undefined) {
					for (let j = 0; j < this.menuItems[i].submenu.length; j++) {
						if (
							this.menuItems[i].submenu[j].click !== undefined &&
							this.checkShortCutValidity(this.menuItems[i].submenu[j].shortcut) &&
							this.menuItems[i].submenu[j].shortcut !== undefined
						) {
							globalShortcut.register(
								this.menuItems[i].submenu[j].shortcut,
								this.menuItems[i].submenu[j].click
							);
						}
					}
				}

				if (
					this.menuItems[i].shortcut != undefined &&
					this.checkShortCutValidity(this.menuItems[i].shortcut)
				) {
					globalShortcut.register(this.menuItems[i].shortcut, this.menuItems[i].click);
				}
			}
		});
	}
}

exports.MyCustomMenu = MyCustomMenu;
