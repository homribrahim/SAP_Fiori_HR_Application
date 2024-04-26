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
               /*  var loginLink = this.getView().byId("loginLink");

                if (loginLink) {
                    loginLink.attachPress(function() {
                        sap.ui.core.BusyIndicator.show(0);
            
                        setTimeout(function() {
                            window.location.href = loginLink.getHref();
                            sap.ui.core.BusyIndicator.hide();
                        }, 500);
                    });
                } else {
                    console.error("Login link not found.");
                } */

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
