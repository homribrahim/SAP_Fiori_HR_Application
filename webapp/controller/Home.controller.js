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
            onScrollToVBox: function() {
                var targetId = this.byId("vb").getId();
               // Get the hash changer instance
                var oHashChanger = UIComponent.getRouterFor(this).getHashChanger();

                // Scroll to the target VBox using HashChanger
                oHashChanger.setHash(targetId);
            } 
        });
    });
