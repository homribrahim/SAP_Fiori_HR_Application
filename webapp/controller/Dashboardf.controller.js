sap.ui.define([
	"sap/ui/Device",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library"
], function (Device,Fragment,syncStyleClass, Controller, JSONModel,Filter,FilterOperator,MessageToast, Popover, Button, library) {
	"use strict";

	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;

	return Controller.extend("brahim.project.controller.DasshboardF", {

		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));
			this.getView().setModel(oModel);
			this._setToggleButtonTooltip(!Device.system.desktop);
            window.addEventListener("resize", this.onWindowResize.bind(this));

            /*Ressources*/
       /*      this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel1 = this.getOwnerComponent().getModel();
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this); */
            /*End Ressources*/
		},
            /*Ressources*/
         /*    handleFullScreen: function () {
                var sNextLayout = this.oModel1.getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
            },
            handleExitFullScreen: function () {
                var sNextLayout = this.oModel1.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
            },
            handleClose: function () {
                var sNextLayout = this.oModel1.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                this.oRouter.navTo("master", {layout: sNextLayout});
            },
            _onProductMatched: function (oEvent) {
                this._product = oEvent.getParameter("arguments").product || this._product || "0";
                this.getView().bindElement({
                    path: "/ProductCollection/" + this._product,
                    model: "products"
                });
            }, */
            /*End Ressources*/

        onWindowResize() {
            const oSideNavigation = this.byId("sideNavigation");
            const screenWidth = window.innerWidth;
        
            if (screenWidth < 1255) {
                oSideNavigation.setExpanded(false); 
            }
        },

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		handleUserNamePress: function (event) {
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'Feedback',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Help',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(event.getSource());
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},
      

	});
});


/* 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library"
],
    
    @param {typeof sap.ui.core.mvc.Controller} Controller
     
    function (Controller,Device,JSONModel,Popover,Button,library) {
        "use strict";

        var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;

        return Controller.extend("brahim.project.controller.Dashboardf", {
            onInit: function () {
                var oModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));
                this.getView().setModel(oModel);
                this._setToggleButtonTooltip(!Device.system.desktop);
                window.addEventListener("resize", this.onWindowResize.bind(this));
             },
             onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
            },
            handleUserNamePress: function (event) {
                var oPopover = new Popover({
                    showHeader: false,
                    placement: PlacementType.Bottom,
                    content: [
                        new Button({
                            text: 'Feedback',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Help',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Logout',
                            type: ButtonType.Transparent
                        })
                    ]
                }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
    
                oPopover.openBy(event.getSource());
            },
            onSideNavButtonPress: function () {
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();
    
                this._setToggleButtonTooltip(bSideExpanded);
    
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },
            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Large Size Navigation');
                } else {
                    oToggleButton.setTooltip('Small Size Navigation');
                }
            },

            onWindowResize() {
                const oSideNavigation = this.byId("sideNavigation");
                const screenWidth = window.innerWidth;
            
                if (screenWidth < 1255) {
                    oSideNavigation.setExpanded(false); 
                }
            },

            onCollapseExpandPress() {
                const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();
                oSideNavigation.setExpanded(!bExpanded);
            },  
        });
    });
 */