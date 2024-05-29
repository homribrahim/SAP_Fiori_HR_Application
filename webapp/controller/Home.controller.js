sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";
 
        return Controller.extend("brahim.project.controller.Home", {
            onInit: function () {
               
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
            },
            onClick: function ()
            {
                    console.log("JHef")
            },
            onConnect: function ()
            {
                window.open("https://app.ouickly.fr/","_blank")
            },
            onScrollToVBox: function() {
                var targetId = this.byId("vb").getId();
               // Get the hash changer instance
                var oHashChanger = UIComponent.getRouterFor(this).getHashChanger();
 
                // Scroll to the target VBox using HashChanger
                oHashChanger.setHash(targetId);
            },
            onImagePress: function()
            {
                window.open("https://app.ouickly.fr/","_blank")
            }
        });
    });