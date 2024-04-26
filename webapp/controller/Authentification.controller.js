sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("brahim.project.controller.Authentification", {
            onInit: function () {

            },

            onDashboard: function (){
                window.open("https://port8080-workspaces-ws-prhhs.eu20.applicationstudio.cloud.sap/index.html#/DashboardF");
            }
        });
    });
