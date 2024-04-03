sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("brahim.project.controller.App", {
        onInit: function() {
        },

        onSideNavButtonPress: function() {
          var oToolPage = this.byId("app");
          var bSideExpanded = oToolPage.getSideExpanded();
          this._setToggleButtonTooltip(bSideExpanded);
          oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
        
      });
    }
  );
  