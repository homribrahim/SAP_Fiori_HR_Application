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
    'sap/ui/core/IconPool',
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"

], function (Device, Controller, JSONModel, Popover, Button, mobileLibrary,Filter,FilterOperator,Sorter,IconPool,Dialog,Text,MessageToast,DateFormat) {
    "use strict";
 
    var ButtonType = mobileLibrary.ButtonType,
        PlacementType = mobileLibrary.PlacementType;

    var DialogType = mobileLibrary.DialogType;
 
    return Controller.extend("brahim.project.controller.Test", {
 
        onInit: function () {

            //Side Nav Loading

            var oSideContentModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));       
            this.getView().setModel(oSideContentModel);
            this._setToggleButtonTooltip(!Device.system.desktop);
            window.addEventListener("resize", this.onWindowResize.bind(this));  

            var oCountryModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/pays.json"));
            oCountryModel.setSizeLimit(1300);
            this.getView().setModel(oCountryModel,"appData");
            
            var b = [];
            var c = {};
            var B = {
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c["BusinessSuiteInAppSymbols"] = B
 
            //Ressources Section
    
            var oCollabModel = this.getOwnerComponent().getModel();
            var that = this;
            /* console.log(oCollabModel) */
           
            oCollabModel.read("/ZCOLLAB_ENTSet", {
              /*   filters: [
                    new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, "manager")
                ],  */
                success: function(data){
                    var xModel = new JSONModel(data);
                    that.getView().setModel(xModel,"odataModel");
                    var x = data.results.length;
                    that.getView().getModel().setProperty("/xValue", x);
                    
                },
                error: function(oError){
                    console.log(oError);
                }
                });

                this.getView().byId("collabDetails").setVisible(false);   
                this.byId("saveButton").setVisible(false);
                this.byId("collabInfosEdit").setVisible(false);
                this.byId("collabCoordEdit").setVisible(false);
                this.byId("collabTableSection").setVisible(false);
                this.byId("addCollabSection").setVisible(false);
                this.byId("headerInfoDisplay").setVisible(true);
                this.byId("headerInfoEdit").setVisible(false);


                var busyLoader = this.byId("busyLoader");
                var collabTableSection = this.byId("collabTableSection");
                
            
                setTimeout(function() {
                    busyLoader.setVisible(false);
                    collabTableSection.setVisible(true)
                }, 4000);

                this.oSF = this.byId("searchField");

         },

        onEdit () 
        {
            this.byId("editButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("collabInfosEdit").setVisible(true);
            this.byId("collabCoordEdit").setVisible(true);
			this.byId("collabInfosDisplay").setVisible(false);
            this.byId("collabCoordDisplay").setVisible(false);
            this.byId("headerInfoDisplay").setVisible(false);
            this.byId("headerInfoEdit").setVisible(true);
        },

        onApproveDialogPress: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Mise à jour du Compte",
					content: new Text({ text: "Confirmez-vous la mise à jour de ce profil ?" }),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Confirmer",
						press: function () {
                            this.byId("collabInfosDisplay").setVisible(true);
                            this.byId("collabCoordDisplay").setVisible(true);
                            this.byId("headerInfoDisplay").setVisible(true);
                            this.byId("saveButton").setVisible(false);
                            this.byId("editButton").setVisible(true);
                            this.byId("collabInfosEdit").setVisible(false);
                            this.byId("collabCoordEdit").setVisible(false);
                            this.byId("headerInfoEdit").setVisible(false);
							MessageToast.show("Profil mis à jour !");
							this.oApproveDialog.close();
                            
						}.bind(this)
					}),
					endButton: new Button({
						text: "Annuler",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
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
            this.getView().byId("collabTableSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("odataModel");
            var sPath = oContext.getPath();
            var oProductDetailPanel = this.byId("collabDetails");
            oProductDetailPanel.bindElement({ path: sPath, model: "odataModel" });
        },

        onSuggest: function (oEvent) {

            var sValue = oEvent.getParameter("suggestValue"),
            aFilters = [];
        if (sValue) {
            aFilters = [
                new Filter([
                    new Filter("Name", function (sText) {
                        return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                    }),
                    new Filter("Prenom", function (sDes) {
                        return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                    })
                ], false)
            ];
        }

        this.oSF.getBinding("suggestionItems").filter(aFilters);
        this.oSF.suggest();
		},

        onOn () {
            // Access xValue from the model and display it
            var xValue = this.getView().getModel().getProperty("/xValue");
            console.log("Value of x in onOn(): " + xValue);
            // You can now use xValue as needed in this function
        },

        onCreateCollab () 
        {
            
            
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy HH:mm" 
            });

            var oDate = new Date();
            var sFormattedDate = oDateFormat.format(oDate);

            console.log(sFormattedDate)

            var ReferenceInterne = this.byId("comp").getValue();
            var Civilite = this.byId("civilite_collab").getSelectedItem().getText();   
            var Nom = this.byId("nom_collab").getValue();
            var Prenom = this.byId("prenom_collab").getValue();
            var Type = this.byId("type_collab").getSelectedItem().getText();
            var Etat = this.byId("etat_collab").getSelectedItem().getText();
            var Titre = this.byId("titre_collab").getValue();
            var Domaine = this.byId("domaine_collab").getSelectedItem().getText();
            var Experience = this.byId("xp_collab").getValue();
            var Mobilite = this.byId("mobilite_collab").getSelectedItem().getText();
            var Email = this.byId("email_collab").getValue();
            var EmailLinkedin = this.byId("linkedin_collab").getValue();
            var code_pays = this.byId("codephone_collab").getSelectedItem().getText();
            var NumTel = this.byId("phone_collab").getValue();
            var DateNaissance = this.byId("naissance_collab").getValue();
            var Nationalite = this.byId("nationalite_collab").getSelectedItem().getText();
            var SituationFamiliale = this.byId("situation_familiale").getSelectedItem().getText();
            var NumeroSecuriteSociale = this.byId("nss").getValue();
            var Adresse = this.byId("adresse_collab").getValue();
            var CodePostal = this.byId("code_postal").getValue();
            var Ville = this.byId("ville_collab").getValue();
            var Pays = this.byId("pays_collab").getSelectedItem().getText();
            var Pole = this.byId("pole_collab").getSelectedItem().getText();
            var Agence = this.byId("agence_collab").getSelectedItem().getText();
            var Diplomes = this.byId("diplome_collab").getValue();
            var DateDemarrage = this.byId("date_demarrage").getValue();
            var Fonction = this.byId("fonction_collab").getValue();
            var IdManager = this.byId("responsable_manager").getSelectedItem().getText();
            var IdRh = this.byId("responsable_rh").getSelectedItem().getText();
            var Role = this.byId("role_collab").getSelectedItem().getText();

            var NumeroTelephone = code_pays + NumTel ;

            var collabData = {}
                collabData.Idcollab = "14000"
                collabData.ReferenceInterne = ReferenceInterne
                collabData.Civilite = Civilite  
                collabData.Nom = Nom
                collabData.Prenom = Prenom
                collabData.Type = Type
                collabData.Etat = Etat
                collabData.Titre = Titre
                collabData.Domaine = Domaine
                collabData.Experience = Experience
                collabData.Mobilite = Mobilite
                collabData.Email = Email
                collabData.EmailLinkedin = EmailLinkedin
                collabData.NumeroTelephone = NumeroTelephone
                collabData.DateNaissance = DateNaissance
                collabData.Nationalite = Nationalite
                collabData.SituationFamiliale = SituationFamiliale
                collabData.NumeroSecuriteSociale = NumeroSecuriteSociale
                collabData.Adresse = Adresse
                collabData.CodePostal = CodePostal
                collabData.Ville = Ville
                collabData.Pays = Pays
                collabData.Pole = Pole
                collabData.Agence = Agence
                collabData.DateCreation = sFormattedDate
                collabData.DateMiseAJour = sFormattedDate
                collabData.Diplomes = Diplomes
                collabData.DateDemarrage = DateDemarrage
                collabData.Fonction = Fonction
                collabData.IdManager = IdManager
                collabData.IdRh = IdRh
                collabData.Role = Role
                collabData.Login = "COLLAB458"
                collabData.MotDePasse = "abcde256"  

            console.log(collabData)

            var oInfoModel = this.getOwnerComponent().getModel();
           
            oInfoModel.create("/ZCOLLAB_ENTSet",collabData, {
                success: function(){
                    console.log("Collaborator ADDED Successfully !")
                    MessageToast.show("Collaborateur Ajouté !");

                },
                error: function(oError){
                    console.log(oError)
                }
                });

                
        },

        onDelete :function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Suppression du Compte",
					content: new Text({ text: "Confirmez-vous la suppression définitive de ce Compte ?" }),
					beginButton: new Button({
						type: ButtonType.Reject,
						text: "Supprimer",
						press: function () {
                            this.byId("collabDetails").setVisible(false);                
                            this.byId("collabTableSection").setVisible(true);

							MessageToast.show("Compte Supprimé !");
							this.oApproveDialog.close();
                            
						}.bind(this)
					}),
					endButton: new Button({
						text: "Annuler",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
        },

        // Visibility Sections
        
        onBack (sectionOne,sectionTwo)
        {
            this.getView().byId(sectionOne).setVisible(false);
            this.getView().byId(sectionTwo).setVisible(true);
        }
 
 
    });
});