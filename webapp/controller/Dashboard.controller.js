sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("brahim.project.controller.Dashboard", {
            onInit: function () {
            },
            onCollapseExpandPress() {
                const oSideNavigation = this.byId("sideNavigation"),
                    bExpanded = oSideNavigation.getExpanded();
                oSideNavigation.setExpanded(!bExpanded);
            },
    
            onHideShowWalkedPress() {
                const oNavListItem = this.byId("walked");
                oNavListItem.setVisible(!oNavListItem.getVisible());
            }
        });
    });
