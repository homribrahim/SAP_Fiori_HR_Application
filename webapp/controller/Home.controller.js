sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("brahim.project.controller.Home", {
            onInit: function () {
            },
        
            onScrollToServices: function() {
                var targetId = this.byId("vb").getId();
                var oHashChanger = UIComponent.getRouterFor(this).getHashChanger();
                 oHashChanger.setHash(targetId);
            },
            onImagePress: function()
            {
                window.open("https://app.ouickly.fr/","_blank")
            }
        });
    });