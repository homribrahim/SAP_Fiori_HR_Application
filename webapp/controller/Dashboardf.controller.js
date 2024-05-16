sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/core/IconPool'
], function (Device, Controller, JSONModel, Popover, Button, library,Filter,FilterOperator,Sorter,IconPool) {
    "use strict";
 
    var ButtonType = library.ButtonType,
        PlacementType = library.PlacementType;
 
    return Controller.extend("brahim.project.controller.Test", {
 
        onInit: function () {

            var b = [];
            var c = {};
 
             //SAP Business Suite Theme font family and URI
            var B = {
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            //Registering to the icon pool
            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c["BusinessSuiteInAppSymbols"] = B
 
            this.getView().byId("collabDetails").setVisible(false);            

            var oCollabModel = this.getOwnerComponent().getModel();
            var that = this;
            console.log(oCollabModel)
           
            oCollabModel.read("/ZCOLLAB_ENTSet", {
                success: function(data){
                    var xModel = new JSONModel(data);
                    that.getView().setModel(xModel,"odataModel")
                    console.log(data)
                },
                error: function(oError){
                    console.log(oError)
                }
                });
 
            var oModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));
            this.getView().setModel(oModel);
            this._setToggleButtonTooltip(!Device.system.desktop);
            window.addEventListener("resize", this.onWindowResize.bind(this));  
        },
       
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
 
        onSearch: function(oEvent)  
        {
            var query = oEvent.getSource().getValue();
            var oList = this.byId("collabTable");
            var oBinding = oList.getBinding("items");
            var aFilter = [];
            if (query)
            {
                var oFilter = new Filter({
                    filters: [      
                      new Filter("Nom", FilterOperator.Contains, query),
                      new Filter("Prenom", FilterOperator.Contains, query),
                     
                    ]})
                aFilter.push(oFilter);                
            }
            oBinding.filter(aFilter);
        },
        
        onItemSelected: function(oEvent) {

            this.getView().byId("collabDetails").setVisible(true);            
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("odataModel");
            var sPath = oContext.getPath();
            var oProductDetailPanel = this.byId("collabDetails");
            oProductDetailPanel.bindElement({ path: sPath, model: "odataModel" });

        }
 
 
    });
});