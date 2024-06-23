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
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/UIComponent",
    "sap/ui/core/library",
    "sap/m/Image",
    "sap/m/HBox",
    "sap/m/VBox",
    "../utils/myFormatter",
    "sap/ui/core/Item"

], function (Device, Controller, JSONModel, Popover, Button, mobileLibrary,Filter,FilterOperator,Sorter,IconPool,Dialog,Text,MessageToast,DateFormat,UIComponent,coreLibrary,Image,HBox,VBox,myFormatter,Item) {
    "use strict";
 

    var ButtonType = mobileLibrary.ButtonType,
        PlacementType = mobileLibrary.PlacementType;

    var DialogType = mobileLibrary.DialogType;
    var ValueState = coreLibrary.ValueState;
    const date = new Date();
    const month = date.getMonth();
    var year = new Date().getFullYear()
    if ( month <=6 )
    {
        var semesterPeriod =  String(1)
    }
    else
    {
        var semesterPeriod = String(2)
    }

    var quarter = "Q"+ String(Math.floor(month / 3) + 1) + "-" + String(year)
    var semester = "S"+ semesterPeriod + "-" + String(year)
 
    return Controller.extend("brahim.project.controller.Dashboardf", {

        stateFormatter :myFormatter ,

        onInit: function () {
  
        /*     if (!window.hasPageReloaded) {
                window.hasPageReloaded = true;
                window.location.reload();
            } */

          
            
            var that = this;
            this.oSF = this.byId("searchField");   

            
          /*   if(!localStorage.getItem("userData"))
                {   
                    location.reload();
                    this.getOwnerComponent().getRouter().navTo("Authentification")
                    this.getOwnerComponent().getRouter().getRoute().stop()
                }  */
            

            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
            };

            var storedData = localStorage.getItem("userData");

            if (storedData) {
                var userData = JSON.parse(storedData);
                var oUserModel = new JSONModel(userData);
                var idCollaborateur = userData.Idcollab
                var nomCollab = userData.Nom
                var prenomCollab = userData.Prenom 
                var emailCollab = userData.Email
                var agenceCollab = userData.Agence
                var poleCOllab = userData.Pole 
                var etatCollab = userData.Etat
                var posteCollab = userData.Fonction
                var ManagerId =userData.IdManager
                var RhId =userData.IdRh
                var role = userData.Role;
                
                console.log(ManagerId)
                console.log(idCollaborateur)

                this.getView().setModel(oUserModel, "oUserdataModel");
                var idCollabModel = new JSONModel({ 
                    idCollaborateur: idCollaborateur,
                    nomCollab : nomCollab,
                    prenomCollab:prenomCollab,
                    emailCollab:emailCollab,
                    agenceCollab:agenceCollab,
                    poleCOllab:poleCOllab,
                    etatCollab:etatCollab,
                    posteCollab:posteCollab,
                    roleCollab:role
                
                });
                that.getView().setModel(idCollabModel, "idCollabModel");

            }
                console.log(oUserModel)
                //Mes Infos RH
                this.getAnciennete(userData.DateDemarrage,"ancienneteProfile")


               //Ressources Section
    
               var oCollabModel = this.getOwnerComponent().getModel();
               var collabManagerList = []
           
               console.log(oCollabModel)

               var arrayIdString = []
              
               oCollabModel.read("/ZCOLLAB_ENTSet", {
                
                   success: function(data){
                       var xModel = new JSONModel(data);
                       that.getView().setModel(xModel,"odataModel");

                       for (let collabData of Object.values(data.results))
                       {    
                        if (collabData.Idcollab == ManagerId)
                        {
                            var Manager = collabData.Prenom + " " + collabData.Nom;
                        
                        }
                        if (collabData.Idcollab == RhId)
                        {
                            var ResponsableRh = collabData.Prenom + " " + collabData.Nom;
                        }
                        if (collabData.IdManager == idCollaborateur)
                        {
                            let newCollab = {
                                IdCollab:collabData.Idcollab ,
                                Collab:collabData.Prenom + " " + collabData.Nom
                            }
                            collabManagerList.push(newCollab)
                            
                        }
   
                       }

                       var Data = idCollabModel.getData();
                       Data.Manager = Manager;
                       idCollabModel.setData(Data);
                       
                       console.log(collabManagerList)
                       
                    
                       if (collabManagerList.length != 0)
                       {
                        var currentData = oUserModel.getData();
                        currentData.Manager = Manager;
                        currentData.ResponsableRh = ResponsableRh;
                        currentData.collabManagerList=collabManagerList
                        oUserModel.setData(currentData);
                       }
                       else
                       {
                        var currentData = oUserModel.getData();
                        currentData.Manager = Manager;
                        currentData.ResponsableRh = ResponsableRh;
                        oUserModel.setData(currentData);
                       }

                       for (let collabData of Object.values(data.results))
                       { 
                            arrayIdString.push(collabData.Idcollab)
                       } 

                       var arrayIdNumber = arrayIdString.map((i) => Number(i));
                       const maxId = Math.max(...arrayIdNumber)
                       var xValueModel = new JSONModel({ xValue: maxId });
                       that.getView().setModel(xValueModel, "xValueModel");
                       
                   },
                   error: function(oError){
                       console.log(oError);
                   }
                   });

                   var oCollabManagerModel = this.getOwnerComponent().getModel();       
                   console.log(oCollabModel)
            
                   oCollabManagerModel.read("/ZCOLLAB_ENTSet", {

                    filters: [new sap.ui.model.Filter("IdManager", sap.ui.model.FilterOperator.EQ, idCollaborateur)],

                       success: function(data)
                       {
                            var oCollabManModel = new JSONModel(data);
                            that.getView().setModel(oCollabManModel,"oCollabManModel");
                            console.log(data);
                       },               
                       error: function(oError)
                       {
                            console.log(oError);
                       }
                })





                
            var listItem = this.getView().byId("navigationList");
            
            // Attach event listener for when the items are rendered
            listItem.addEventDelegate({
                onAfterRendering: function() {
                    console.log(listItem);
                    console.log(listItem.getItems());
                    if (role == "collaborateur")
                    {
                        listItem.getItems()[2].setVisible(false)
                        listItem.getItems()[3].getItems()[2].setVisible(false)
                        listItem.getItems()[3].getItems()[3].setVisible(false)
                        listItem.getItems()[4].getItems()[1].setVisible(false)
                        listItem.getItems()[4].getItems()[2].setVisible(false)
                    }
                    else if  (role == "manager")
                    {   
                        console.log('Manager')
/*                         that.getView().byId("collabTableManager").setVisible(true) 
 */                        that.getView().byId("collabTable").setVisible(true)

                    }
                    else if  (role == "RH")
                    {   
                        console.log('RH')
                        that.getView().byId("collabTable").setVisible(true)


                    } 



                }
            });

            /*Loading SideContent JSON*/

            var oSideContentModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));       
            this.getView().setModel(oSideContentModel);
            this._setToggleButtonTooltip(!Device.system.desktop);
            window.addEventListener("resize", this.onWindowResize.bind(this));  


            /* Loading Countries JSON */
            var oCountryModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/pays.json"));
            oCountryModel.setSizeLimit(1300);
            this.getView().setModel(oCountryModel,"appData");

            /*Loading Fonts*/
            
            var b = [];
            var c = {};
            var B = {
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c["BusinessSuiteInAppSymbols"] = B


            /*Consolidataion Des Résultats*/

            var oAutoEvalModel = this.getOwnerComponent().getModel();

            oAutoEvalModel.read("/ZAUTOEVAL_ENTSet", {
                
                success: function(data){
                    var oAutoEvalModel = new JSONModel(data)
                    that.getView().setModel(oAutoEvalModel,"oAutoEvalModel")
                    console.log(oAutoEvalModel)  
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            var oAutoEvalCollabModel = this.getOwnerComponent().getModel();

            console.log(idCollaborateur)
          
            oAutoEvalCollabModel.read("/ZAUTOEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
                
                success: function(data){
                    var oAutoEvalCollabModel = new JSONModel(data);         
                    that.getView().setModel(oAutoEvalCollabModel,"oAutoEvalCollabModel");
                    if (data)
                    {
                        
                        console.log(data)
                    if ( data.results.find(obj => obj.Trimestre === quarter) )
                        {
                            that.byId("noAutoEval").setVisible(true);
                            that.byId("evaluationCollab").setVisible(false);
                            console.log("Hello Darkness")
                        }
                    }
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            var oEvalModel = this.getOwnerComponent().getModel();

            oEvalModel.read("/ZEVAL_ENTSet", {
                
                success: function(data){
                    
                    var oEvalModel = new JSONModel(data)
                    that.getView().setModel(oEvalModel,"oEvalModel")
                    console.log(oEvalModel)  
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            
                var oEngPulseModel = this.getOwnerComponent().getModel();
          
                oEngPulseModel.read("/ZENGPULSE_ENTSet", {
    
                    success: function(data){
                        var oEngPulseModel = new JSONModel(data);         
                        that.getView().setModel(oEngPulseModel,"oEngPulseModel");
                       
                         
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                    });



            var oEngPulseCollabModel = this.getOwnerComponent().getModel();
          
            oEngPulseCollabModel.read("/ZENGPULSE_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
                
                success: function(data){
                    var oEngPulseCollabModel = new JSONModel(data);         
                    that.getView().setModel(oEngPulseCollabModel,"oEngPulseCollabModel");
                    if (data)
                    {
                        console.log(data)   
                        if ( data.results.find(obj => obj.Semestre === semester) )
                        {
                            that.byId("noEngPulse").setVisible(true);
                            that.byId("engagementCollab").setVisible(false);
                            console.log("Hello Darkness")
                        }            
                    }
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });


           
            

            /*Auto Evaluation COLLAB Section*/

               /* VISIBILITY */

                this.getView().byId("collabDetails").setVisible(false);   
                this.byId("saveButton").setVisible(false);
                this.byId("collabInfosEdit").setVisible(false);
                this.byId("collabCoordEdit").setVisible(false);
                this.byId("collabTableSection").setVisible(false);
                this.byId("addCollabSection").setVisible(false);
                this.byId("headerInfoDisplay").setVisible(true);
                this.byId("headerInfoEdit").setVisible(false);
                this.byId("noAutoEval").setVisible(false);
                this.byId("infoPanel2").setVisible(false);
                this.byId("infoPanel3").setVisible(false);
                this.getView().byId("collabEvalDetails").setVisible(false);   
                this.getView().byId("collabEngPulseDetails").setVisible(false);   
                this.byId("noEngPulse").setVisible(false);

                var busyLoader = this.byId("busyLoader");
                var collabTableSection = this.byId("collabTableSection");
            
                setTimeout(function() {
                    busyLoader.setVisible(false);
                    collabTableSection.setVisible(true)
                }, 4000); 
                
             /*    this.byId("toolPage").setVisible(false);
                this.byId("imgLogo").setVisible(true);

                var toolPage = this.byId("toolPage").setVisible(false);
                var imgLogo = this.byId("imgLogo").setVisible(true); */



         /*  /*   setTimeout(function() {
                imgLogo.setVisible(false);
                toolPage.setVisible(true);
            }, 4000);   */
            }, 


        onPageReload ()
        {
            window.location.reload()
        },

        getIDEval (mode)
        {
            var idCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur");
            var result = '';
            var characters = '0123456789';
              
            for (var i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * 10));
            }
            
            var IDEVAL= mode + idCollabConn + result;            
            return IDEVAL
        },

        getCurrentDate: function() {
            var now = new Date();
            var day = String(now.getDate())
            var month = String(now.toLocaleString('default', { month: 'long' }));
            var year = String(now.getFullYear())
         
           return (day  + " " + month + " " + year)
 
           
 
           /*  var dateAutoEvalModel = new JSONModel({ dateAutoEval: dateAutoEval });
            this.getView().setModel(dateAutoEvalModel, "dateAutoEvalModel"); */
 
        },
 

        onSendAutoEval () 
        {
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 2) {
                var period = "Q1"; // January to March
            } else if (month <= 5) {
                var period = "Q2"; // April to June
            } else if (month <= 8) {
                var period = "Q3"; // July to September
            } else {
                var period = "Q4"; // October to December
            }

            for (var i = 1; i <= 5; i++) {

                var oRadioButtonGroup = this.getView().byId("radioQuestions" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                answersTab.push(indice+1)
            }           

            var oCommentAnswer = this.getView().byId("comment").getValue();
            answersTab.push(oCommentAnswer)
            console.log(answersTab) 
            
            var IDEVAL = this.getIDEval("AUTOEVAL")
            var Trimestre = period + "-" + year
            var endAutoEval = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Email = this.getView().getModel("idCollabModel").getProperty("/emailCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var Etat = this.getView().getModel("idCollabModel").getProperty("/etatCollab")
            var Poste = this.getView().getModel("idCollabModel").getProperty("/posteCollab")
            var Manager = this.getView().getModel("idCollabModel").getProperty("/Manager")
            var startAutoEval = this.getView().getModel("startAutoEvalModel").getProperty("/startAutoEval");
            var dateAutoEval = this.getCurrentDate()
            var autoEvalData = {
                IdAutoeval : IDEVAL,
                Nom : Nom,
                Email : Email,
                DateA : dateAutoEval,
                HDebut : startAutoEval,
                Prenom : Prenom,
                Agence : Agence,
                HFin : endAutoEval,
                Pole : Pole,
                Trimestre : Trimestre,
                Manager : Manager, 
                Etat : Etat,
                Poste : Poste,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),
                Question4 : answersTab[3].toString(),
                Question5 : answersTab[4].toString(),
                Commentaire : answersTab[5].toString(),
                Idcollab : iDCollabConn
            }

            console.table(autoEvalData)
            var that =this
            var oAutoEvalModel = this.getOwnerComponent().getModel();
           
            oAutoEvalModel.create("/ZAUTOEVAL_ENTSet",autoEvalData, {
                success: function(){
                    console.log("Auto Eval Added Successfully !")  
                    

                    that.byId("noAutoEval").setVisible(true);
                    that.byId("evaluationCollab").setVisible(false);
            
                },  
                
                error: function(oError){
                    console.log(oError)
                }
                });

            this.onSuccessMessageDialogPress("Votre réponse a été envoyée. Nous vous remercions pour le temps que vous avez consacré à votre auto-évaluation ✅Votre manager reviendra vers vous dans les prochains jours pour finaliser le processus d'entretien d'évaluation des performances par un échange de vive voix 🌟🚀Excellente journée.")
        },

        onSuccessMessageDialogPress: function (SUCCESSDESC) {
			if (!this.oSuccessMessageDialog) {
				this.oSuccessMessageDialog = new Dialog({
					type: DialogType.Message,
					title: "Success",
					state: ValueState.Success,
                    contentWidth:"1000px",
                    content: [
                      
                        new HBox({
                            items: [

                                new VBox(
                                    {   
                                        justifyContent: "Center",
                                        items : [
                                            new Text({
                                                text: SUCCESSDESC,
                                                textAlign: "Center",                                      
                                            }),                                        
                                        ]
                                    }
                                ),
                                                                       
                                new Image({ 
                                    src: "../utils/images/astronaut.png",
                                    width: "400px"
                                })
                            ],
                            
                            justifyContent: "Center"
                        })],
                                   
					beginButton: new Button({
						type: ButtonType.Success,
						text: "OK",
						press: function () {
							this.oSuccessMessageDialog.close();
                            window.location.reload();
						}.bind(this)
					})
				});
			}

			this.oSuccessMessageDialog.open();


		},

        onStartAutoEval ()
        {   
            this.getView().byId("radioQuestions1").setEnabled(true)
            this.getView().byId("radioQuestions2").setEnabled(true)
            this.getView().byId("radioQuestions3").setEnabled(true)
            this.getView().byId("radioQuestions4").setEnabled(true)
            this.getView().byId("radioQuestions5").setEnabled(true)
            this.getView().byId("comment").setEnabled(true)

            var now = new Date();
            var day = String(now.getDate())
            var month = String(now.toLocaleString('default', { month: 'long' }));
            var year = String(now.getFullYear())
                console.log(day  + " " + month + " " + year)




            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startAutoEval = hours + ":" + minutes + ":" + seconds;
            var startAutoEvalModel = new JSONModel({ startAutoEval: startAutoEval });
            this.getView().setModel(startAutoEvalModel, "startAutoEvalModel");

            console.log(startAutoEval)
            
        },        

        onDisappearInfoPanel2 ()
        {
            var that=this
            this.getView().byId("radioQuest1").setEnabled(true)
            this.getView().byId("radioQuest2").setEnabled(true)
            this.getView().byId("radioQuest3").setEnabled(true)
            this.getView().byId("radioQuest4").setEnabled(true)
            this.getView().byId("radioQuest5").setEnabled(true)
            this.getView().byId("radioQuest6").setEnabled(true)
            this.getView().byId("commentEval").setEnabled(true)
            this.getView().byId("infoPanel3").setVisible(false)

            var quarterNow = new JSONModel({quarter : quarter});         
            this.getView().setModel(quarterNow,"quarterNow");            
            this.getView().byId("infoPanel2").setVisible(false)
            var Collab = this.byId("collabSelect").getSelectedItem().getKey()
            var idCollaborateur = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            console.log(Collab)
            var oEvalCollabModel = this.getOwnerComponent().getModel();

            oEvalCollabModel.read("/ZEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idmanager", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
        
                success: function(data){    
                    if (data)
                    {   
                        
                    if ( data.results.find((obj => obj.Trimestre === quarter) && (obj => obj.Idcollab === Collab)) )
                        {
                            that.getView().byId("radioQuest1").setEnabled(false)
                            that.getView().byId("radioQuest2").setEnabled(false)
                            that.getView().byId("radioQuest3").setEnabled(false)
                            that.getView().byId("radioQuest4").setEnabled(false)
                            that.getView().byId("radioQuest5").setEnabled(false)
                            that.getView().byId("radioQuest6").setEnabled(false)
                            that.getView().byId("commentEval").setEnabled(false)            
                            that.getView().byId("infoPanel3").setVisible(true)

                            setTimeout(function() {
                                $( that.getView().byId("infoPanel3").getDomRef()).animate({
                                    opacity: 0,
                                    top: "-=50" 
                                },"slow", function() {
                                    that.getView().byId("infoPanel3").setVisible(false);
                                });

                            }, 5000);
                        }
                    }
                },
                error: function(oError){
                    console.log(oError);
                }
                });

        },
        
        onStartEval ()
        {
           
            this.getView().byId("collabSelect").setEnabled(true)
            this.getView().byId("radioQuest1").setEnabled(true)
            this.getView().byId("radioQuest2").setEnabled(true)
            this.getView().byId("radioQuest3").setEnabled(true)
            this.getView().byId("radioQuest4").setEnabled(true)
            this.getView().byId("radioQuest5").setEnabled(true)
            this.getView().byId("radioQuest6").setEnabled(true)
            this.getView().byId("commentEval").setEnabled(true)
           $( this.getView().byId("infoPanel1").getDomRef()).animate({
                opacity: 0,
                top: "-=50" 
            },"slow", function() {
                that.getView().byId("infoPanel1").setVisible(false);
            });
            this.getView().byId("infoPanel2").setVisible(true)

            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startEval = hours + ":" + minutes + ":" + seconds;
            var startEvalModel = new JSONModel({ startEval: startEval });
            this.getView().setModel(startEvalModel, "startEvalModel");

            console.log(startEval)
        },

        onStartEngPulse ()
        {
            this.getView().byId("radioEngPulseQuestions2").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions3").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions4").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions5").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions6").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions7").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions8").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions9").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions10").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions11").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions12").setEnabled(true)
            this.getView().byId("commentEng1").setEnabled(true)
            this.getView().byId("commentEng2").setEnabled(true)
            this.getView().byId("commentEng3").setEnabled(true)
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startEngPulse = hours + ":" + minutes + ":" + seconds;
            var startEngPulseModel = new JSONModel({ startEngPulse: startEngPulse });
            this.getView().setModel(startEngPulseModel, "startEngPulseModel");
            console.log(startEngPulse)
        },

        onSendEngPulse ()
        { 
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 6)
            {
                var period = "S1"; 
            }
            else 
            {
                var period = "S2"; 
            }

            var role = (this.getView().getModel("idCollabModel").getProperty("/roleCollab"))
            answersTab.push((role=="manager") ? "Oui" : "Non")
            var x = this.getView().byId("radioEngPulseQuestions2").getSelectedButton().getText()
            
            answersTab.push(x)
            answersTab.push(this.getView().byId("radioEngPulseQuestions3").getSelectedButton().getText())
            answersTab.push(this.getView().byId("radioEngPulseQuestions4").getSelectedButton().getText())
            answersTab.push(this.getView().byId("commentEng1").getValue())
            answersTab.push(this.getView().byId("commentEng2").getValue())
            answersTab.push(this.getView().byId("commentEng3").getValue())

            for (var i = 5; i <= 12; i++) {

                var oRadioButtonGroup = this.getView().byId("radioEngPulseQuestions" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                answersTab.push(indice+1)

            }     
            
            var IDENGPULSE = this.getIDEval("ENGPULSE")
            var Semestre = period + "-" + year
            var endEngPulse = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var startEngPulse = this.getView().getModel("startEngPulseModel").getProperty("/startEngPulse");
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var dateEngPulse = this.getCurrentDate()
            var EngPulseData = {
                IdEngpulse : IDENGPULSE,
                Nom : Nom,
                Prenom : Prenom,
                Semestre : Semestre,
                DateEp : dateEngPulse,
                HDebut : startEngPulse,
                HFin : endEngPulse,
                Role : role,
                Agence : Agence,
                Pole : Pole,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),
                Question4 : answersTab[3].toString(),   
                Question5 : answersTab[4].toString(),
                Question6 : answersTab[5].toString(),
                Question7 : answersTab[6].toString(),
                Question8 : answersTab[7].toString(),
                Question9 : answersTab[8].toString(),
                Question10 : answersTab[9].toString(),   
                Question11 : answersTab[10].toString(),
                Question12 : answersTab[11].toString(),
                Question13 : answersTab[12].toString(),
                Question14 : answersTab[13].toString(),
                Question15 : answersTab[14].toString(),
                Idcollab : iDCollabConn
            }
            console.log(EngPulseData)

            var oEngPulseModel = this.getOwnerComponent().getModel();
           
            oEngPulseModel.create("/ZENGPULSE_ENTSet",EngPulseData, {
                success: function(){
                    console.log("Engagement Pulse Added Successfully !")  // You will get Bad Request beacuse NoteGlobale doesn"t support 2.33 (value with .)

                  /*   that.byId("noAutoEval").setVisible(true);
                    that.byId("evaluationCollab").setVisible(false); */
            
                },  
                
                error: function(oError){
                    console.log(oError)
                }
                });

            this.onSuccessMessageDialogPress("Votre réponse a été envoyée.Nous vous remercions pour le temps que vous avez consacré à l'évaluation de performance pulse de votre collaborateur ✅L'équipe RH et votre ressource Manager reviendront vers vous pour partager les résultats d'évaluation des performances trimestrielles de votre équipe par un échange de vive voix et de clôturer l'exercice🌟Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀Excellente journée.") 
         

        },

        
        onSendEval () 
        {    
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 2) {
                var period = "Q1"; // January to March
            } else if (month <= 5) {
                var period = "Q2"; // April to June
            } else if (month <= 8) {
                var period = "Q3"; // July to September
            } else {
                var period = "Q4"; // October to December
            }

            for (var i = 1; i <= 6; i++) {

                var oRadioButtonGroup = this.getView().byId("radioQuest" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                if ((i==3) || (i==5))
                {
                    if (indice == 0)
                    {
                        answersTab.push(indice+5)
                    }
                    else 
                    {
                        answersTab.push(indice+2)
                    }

                }  
                else if (i==4)
                {
                    if (indice == 0)
                    {
                        answersTab.push(indice+1)
                    }
                    else 
                    {
                        answersTab.push(indice+2)
                    }
                } 
                else
                {
                    answersTab.push(indice+1)
                }
            }           

            var oCommentAnswer = this.getView().byId("commentEval").getValue();
            answersTab.push(oCommentAnswer)
            console.log(answersTab) 
            var sum = 0

            for (var i = 0; i <= 5; i++)
            {
                sum = sum + answersTab[i]
            }

            var IDEVAL = this.getIDEval("EVAL")
            var Trimestre = period + "-" + year
            var endAutoEval = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var startAutoEval = this.getView().getModel("startEvalModel").getProperty("/startEval");
            var NoteGlobale =  parseFloat((sum / 6).toFixed(2))
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Email = this.getView().getModel("idCollabModel").getProperty("/emailCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var Idcollab = this.byId("collabSelect").getSelectedItem().getKey()
            var Collaborateur = this.byId("collabSelect").getSelectedItem().getText()
            var dateEval = this.getCurrentDate()
            var EvalData = {
                IdEval : IDEVAL,
                Nom : Nom,
                HDebut : startAutoEval,
                Datee : dateEval,
                Prenom : Prenom,
                Email : Email,
                Collaborateur:Collaborateur,
                HFin : endAutoEval,
                Agence : Agence,
                Trimestre : Trimestre,
                Pole: Pole,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),//Si oui 5 , sinon 3
                Question4 : answersTab[3].toString(),//Si oui 1 , sinon 3   
                Question5 : answersTab[4].toString(),//Si oui 5 , sinon 3
                Question6 : answersTab[5].toString(),
                Commentaire : answersTab[6].toString(),
                NoteGlobale : NoteGlobale.toString(),
                Idmanager:iDCollabConn,
                Idcollab : Idcollab
            }

            console.table(EvalData)
            var oEvalModel = this.getOwnerComponent().getModel();
           
            oEvalModel.create("/ZEVAL_ENTSet",EvalData, {
                success: function(){
                    console.log("Eval Added Successfully !")  // You will get Bad Request beacuse NoteGlobale doesn"t support 2.33 (value with .)

                  /*   that.byId("noAutoEval").setVisible(true);
                    that.byId("evaluationCollab").setVisible(false); */
            
                },  
                
                error: function(oError){
                    console.log(oError)
                }
                });

            this.onSuccessMessageDialogPress("Votre réponse a été envoyée.Nous vous remercions pour le temps que vous avez consacré à l'évaluation de performance pulse de votre collaborateur ✅L'équipe RH et votre ressource Manager reviendront vers vous pour partager les résultats d'évaluation des performances trimestrielles de votre équipe par un échange de vive voix et de clôturer l'exercice🌟Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀Excellente journée.") 
        },
    
         onDisconnect ()
         {     
            localStorage.removeItem("userData");

            // Navigate to the authentication page
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Authentification", {}, true); 
            window.location.reload();


         },

        onEdit () 
        {
            this.byId("editButton").setVisible(false);
            this.byId("deleteButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("collabInfosEdit").setVisible(true);
            this.byId("collabCoordEdit").setVisible(true);
			this.byId("collabInfosDisplay").setVisible(false);
            this.byId("collabCoordDisplay").setVisible(false);
            this.byId("headerInfoDisplay").setVisible(false);
            this.byId("headerInfoEdit").setVisible(true);
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
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "odataModel" });
            
            var currentIdCollab = new JSONModel({ 
                    currentIdCollab: (this.getView().getModel("odataModel").getProperty(sPath)).Idcollab ,
                    currentCivilite: (this.getView().getModel("odataModel").getProperty(sPath)).Civilite ,
                    currentNom: (this.getView().getModel("odataModel").getProperty(sPath)).Nom ,
                    currentPrenom: (this.getView().getModel("odataModel").getProperty(sPath)).Prenom ,
                    currentType: (this.getView().getModel("odataModel").getProperty(sPath)).Type ,
                    currentPole: (this.getView().getModel("odataModel").getProperty(sPath)).Pole ,
                    currentFonction: (this.getView().getModel("odataModel").getProperty(sPath)).Fonction ,
                    currentAgence : (this.getView().getModel("odataModel").getProperty(sPath)).Agence ,
                    currentDateCreation : (this.getView().getModel("odataModel").getProperty(sPath)).DateCreation,
                    currentIdManager : (this.getView().getModel("odataModel").getProperty(sPath)).IdManager,
                    currentIdRh : (this.getView().getModel("odataModel").getProperty(sPath)).IdRh,
                    currentLogin : (this.getView().getModel("odataModel").getProperty(sPath)).Login,
                    currentPassword : (this.getView().getModel("odataModel").getProperty(sPath)).MotDePasse,
                    currentRole :  (this.getView().getModel("odataModel").getProperty(sPath)).Role,
                    currentState : (this.getView().getModel("odataModel").getProperty(sPath)).Etat,     
                    currentStartDate : (this.getView().getModel("odataModel").getProperty(sPath)).DateDemarrage
                    
                });

            this.getView().setModel(currentIdCollab, "currentIdCollabModel");       
            var currentStartDate = this.getView().getModel("currentIdCollabModel").getProperty("/currentStartDate");
            this.getAnciennete(currentStartDate,"anciennete")


            //Model to read AUTOEVAL FOR COLLABORATOR

            var currentId = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
            console.log(currentId)

            var currentIdManager = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdManager");
            console.log(currentIdManager)

            var currentIdRH = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdRh");
            console.log(currentIdRH)

            var that = this

            
            var oAutoEvalSelectedCollabModel = this.getOwnerComponent().getModel();
          
            oAutoEvalSelectedCollabModel.read("/ZAUTOEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentId)],
                
                success: function(data){
                    console.log(data)
                    var oAutoEvalSelectedCollabModel = new JSONModel(data);         
                    that.getView().setModel(oAutoEvalSelectedCollabModel,"oAutoEvalSelectedCollabModel");
                   
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });

                //Model to read RH AND MANAGER FOR COLLABORATOR

                
            
            var oCollabManagerModel = this.getOwnerComponent().getModel()

            oCollabManagerModel.read("/ZCOLLAB_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentIdManager)],

                    success: function(data){
                        var oCollabManager = new JSONModel(data)
                        var Manager =  oCollabManager.oData.results[0].Prenom + " " + oCollabManager.oData.results[0].Nom 
                        var oCollabManagerModel = new JSONModel({Manager : Manager})
                        that.getView().setModel(oCollabManagerModel,"oCollabManagerModel");
                        console.log(Manager)
                                       
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                    });

                var oCollabRHModel = this.getOwnerComponent().getModel()
                oCollabRHModel.read("/ZCOLLAB_ENTSet", {
        
                        filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentIdRH)],
     
                            success: function(data){
                                var oCollabRH = new JSONModel(data)
                                var RH =  oCollabRH.oData.results[0].Prenom + " " + oCollabRH.oData.results[0].Nom 
                                var oCollabRHModel = new JSONModel({RH : RH})
                                that.getView().setModel(oCollabRHModel,"oCollabRHModel");
                                console.log(RH)
        
                            },
                            error: function(oError){
                                console.log(oError);
                            }
                            });
        },

        onEvalSelect : function(oEvent) {
            this.getView().byId("collabEvalDetails").setVisible(true);   
            this.getView().byId("collabEvalSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("oEvalModel");
            var sPath = oContext.getPath();
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabEvalDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "oEvalModel" });

            var currentEval = new JSONModel({ 
                currentId: (this.getView().getModel("oEvalModel").getProperty(sPath)).Idcollab})

            this.getView().setModel(currentEval, "currentEval"); 

            var oAutoEvalModel = this.getView().getModel("oAutoEvalModel")
            console.log(oAutoEvalModel.oData.results)
            var currentIdEval = this.getView().getModel("currentEval").getProperty("/currentId");
            var collabAutoEvalObj = {}
            var i=-1
            var SPathAE = ""

            console.log(this.getView().getModel("oEvalModel").getProperty(sPath))                      

            for (let collabData of Object.values(oAutoEvalModel.oData.results))
            { 
                i = i+1
                if (currentIdEval == collabData.Idcollab)
                {
                    collabAutoEvalObj =collabData
                    break;
                }
            }
         
            console.log(collabAutoEvalObj)
            console.log(i)
        
            
            if (Object.keys(collabAutoEvalObj).length >0)
            {
                this.getView().byId("autoEvalDetailsSection").setVisible(true);

                SPathAE = "/results/"+String(i)
                oCollabDetailPanel.bindElement({ path: SPathAE, model: "oAutoEvalModel" });
            }
            else
            {
              this.getView().byId("autoEvalDetailsSection").setVisible(false);

                console.log("No Auto Eval")
            } 

        },

        onEngPulseSelect : function(oEvent) 
        {
            this.getView().byId("collabEngPulseDetails").setVisible(true);   
            this.getView().byId("collabEngPulseSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("oEngPulseModel");
            var sPath = oContext.getPath();
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabEngPulseDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "oEngPulseModel" });
        },

        getAnciennete (currentStartDate,ancienneteId)
        {
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd" });
            var oDate = new Date();
            var sFormattedDate = oDateFormat.format(oDate);          
            const date1 = new Date(currentStartDate);
            const date2 = new Date(sFormattedDate);
                     
/*          let diffDays = date2.getDay() - date1.getDay(); */        
            let yearsDiff = date2.getFullYear() - date1.getFullYear();
            let monthsDiff = date2.getMonth() - date1.getMonth();          
            if (monthsDiff < 0) {
                yearsDiff--;
                monthsDiff += 12; }                              
     
            var anciennete = yearsDiff + " an(s) et " + monthsDiff + " mois"     
            this.byId(ancienneteId).setText(anciennete)
        },

      

        getLogin :function (DD,CV,PL,AG,IDC)
        {
            //DD : date démarrage
            //CV : civilité
            //PL : pole
            //AG : agence
            //IDC : idcollab

            //Date Demarrage
            const lastTwoDigits = (DD.substr(2,2));
            
            //Civilite
            if (CV == 'Mme.') 
               var civiliteCollab = 'F'
            else if (CV == 'M.')
               var civiliteCollab = 'H'

            //Pole
            if (PL == 'ADMINISTRATIF et FINANCIER')
               var poleCollab = 'A'
            else if ( PL == 'SAP BASIS' )
                var poleCollab = 'B'
            else if (PL == 'COMMERCIAL')
                var poleCollab = 'C'
            else if (PL == 'DIGITAL')
                var poleCollab = 'D'
            else if (PL == 'DIRECTION') 
                var poleCollab = 'Dir'
            else if (PL == 'OPERATION')
                var poleCollab = 'O'
            else if (PL == 'PMO')
                var poleCollab = 'P'
            else if (PL == 'RESSOURCE HUMAINE')
                var poleCollab = 'R'
            else if (PL == 'SAP FONCTIONNEL')
                var poleCollab = 'F'
            else if (PL == 'SAP TECHNIQUE')
                var poleCollab = 'T'

            //Agence
            if (AG == 'AYMAX EGYPTE')
               var agenceCollab = 'A'
            else if (AG == 'AYMAX CONSULTING')
                var agenceCollab = 'B'
            else if (AG == 'AYMAX TECHNOLOGY')
                var agenceCollab = 'T'
            
            return lastTwoDigits+civiliteCollab+poleCollab+agenceCollab+IDC
              
        },

        onCreateCollab () 
        {
            var xValue = this.getView().getModel("xValueModel").getProperty("/xValue");
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy HH:mm" 
            });

            var oDate = new Date();
            var sFormattedDate = oDateFormat.format(oDate);
            console.log(sFormattedDate)
            var IdCollab = (xValue +1);
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
            var code_pays = this.byId("codephone_collab").getText();
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
            var IdManager = this.byId("responsable_manager").getSelectedItem().getKey();
            var IdRh = this.byId("responsable_rh").getSelectedItem().getKey();
            var Role = this.byId("role_collab").getSelectedItem().getText();
            var Login = this.getLogin(DateDemarrage,Civilite,Pole,Agence,IdCollab.toString())
            var NumeroTelephone = code_pays + NumTel ;
            var collabData = {}
                collabData.Idcollab = IdCollab.toString()
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
                collabData.Login = Login
                collabData.MotDePasse = "INIT"+IdCollab.toString()

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
                            var currentIdCollab = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
                            var currentCivilite = this.getView().getModel("currentIdCollabModel").getProperty("/currentCivilite");
                            var currentNom = this.getView().getModel("currentIdCollabModel").getProperty("/currentNom");
                            var currentPrenom = this.getView().getModel("currentIdCollabModel").getProperty("/currentPrenom");
                            var currentType = this.getView().getModel("currentIdCollabModel").getProperty("/currentType");
                            var currentPole = this.getView().getModel("currentIdCollabModel").getProperty("/currentPole");
                            var currentFonction = this.getView().getModel("currentIdCollabModel").getProperty("/currentFonction");
                            var currentDateCreation = this.getView().getModel("currentIdCollabModel").getProperty("/currentDateCreation");
                            var currentAgence = this.getView().getModel("currentIdCollabModel").getProperty("/currentAgence");
                            var currentIdManager = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdManager");
                            var currentIdRh = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdRh");
                            var currentLogin = this.getView().getModel("currentIdCollabModel").getProperty("/currentLogin");
                            var currentPassword = this.getView().getModel("currentIdCollabModel").getProperty("/currentPassword");
                            var currentRole = this.getView().getModel("currentIdCollabModel").getProperty("/currentRole");

                            var oDateFormat = DateFormat.getDateInstance({
                                pattern: "dd/MM/yyyy HH:mm" 
                            });
                
                            var oDate = new Date();
                            var sFormattedDate = oDateFormat.format(oDate);
                
                            console.log(sFormattedDate)
                
                            var ReferenceInterne = this.byId("comp_edit").getValue();
                            var Etat = this.byId("etat_collab_edit").getValue();
                            var Titre = this.byId("titre_collab_edit").getValue();
                            var Domaine = this.byId("domaine_collab_edit").getValue();
                            var Experience = this.byId("xp_collab_edit").getValue();
                            var Mobilite = this.byId("mobilite_collab_edit").getValue();
                            var Email = this.byId("email_collab_edit").getValue();
                            var EmailLinkedin = this.byId("linkedin_collab_edit").getValue();                           
                            var NumTel = this.byId("phone_collab_edit").getValue();
                            var DateNaissance = this.byId("naissance_collab_edit").getValue();
                            var Nationalite = this.byId("nationalite_collab_edit").getValue();
                            var SituationFamiliale = this.byId("situation_familiale_edit").getValue();
                            var NumeroSecuriteSociale = this.byId("nss_edit").getValue();
                            var Adresse = this.byId("adresse_collab_edit").getValue();
                            var CodePostal = this.byId("code_postal_edit").getValue();
                            var Ville = this.byId("ville_collab_edit").getValue();
                            var Pays = this.byId("pays_collab_edit").getValue();
                            var Diplomes = this.byId("diplome_collab_edit").getValue();
                            var DateDemarrage = this.byId("date_demarrage_edit").getValue();
                                  
                            var collabData = {}
                                collabData.Idcollab = currentIdCollab
                                collabData.ReferenceInterne = ReferenceInterne
                                collabData.Civilite = currentCivilite  
                                collabData.Nom = currentNom
                                collabData.Prenom = currentPrenom
                                collabData.Type = currentType
                                collabData.Etat = Etat
                                collabData.Titre = Titre
                                collabData.Domaine = Domaine
                                collabData.Experience = Experience
                                collabData.Mobilite = Mobilite
                                collabData.Email = Email
                                collabData.EmailLinkedin = EmailLinkedin
                                collabData.NumeroTelephone = NumTel
                                collabData.DateNaissance = DateNaissance
                                collabData.Nationalite = Nationalite
                                collabData.SituationFamiliale = SituationFamiliale
                                collabData.NumeroSecuriteSociale = NumeroSecuriteSociale
                                collabData.Adresse = Adresse
                                collabData.CodePostal = CodePostal
                                collabData.Ville = Ville
                                collabData.Pays = Pays
                                collabData.Pole = currentPole
                                collabData.Agence = currentAgence
                                collabData.DateCreation = currentDateCreation //current
                                collabData.DateMiseAJour = sFormattedDate
                                collabData.Diplomes = Diplomes
                                collabData.DateDemarrage = DateDemarrage
                                collabData.Fonction = currentFonction
                                collabData.IdManager = currentIdManager
                                collabData.IdRh = currentIdRh
                                collabData.Role = currentRole
                                collabData.Login = currentLogin
                                collabData.MotDePasse = currentPassword

                            console.log(collabData)
                      
                    var oUpdateModel = this.getOwnerComponent().getModel();
                
                    oUpdateModel.update("/ZCOLLAB_ENTSet(Mandt='200',Idcollab='" + currentIdCollab + "')",collabData,
                    {         
                        success:function()
                        {
                            this.oApproveDialog.close();
                            console.log("User Updated Successfuly !")
                            MessageToast.show("Profil mis à jour !");
                            this.byId("deleteButton").setVisible(true);
                        },
                        error:function(oError)
                        {
                            console.log(oError)
                        }
                    })}.bind(this)
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
                            var currentIdCollab = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
                            var oDeleteModel = this.getOwnerComponent().getModel();

                            oDeleteModel.remove("/ZCOLLAB_ENTSet(Mandt='200',Idcollab='" + currentIdCollab + "')",
                            {         
                                success:function()
                                {
                                    console.log("User Deleted Successfully !")
                                    MessageToast.show("Compte Supprimé !");
							        this.oApproveDialog.close();
                                },
                                error:function(oError)
                                {
                                    console.log(oError)
                                }
                            }) 

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

        onCountryChange: function (oEvent) {

            const selectedItem = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getView().getModel("appData").getProperty("/Countries");
            for (const countryData of Object.values(oModel)) {
                if (countryData.code === selectedItem) {
                    var sSelectedKey = countryData.dial_code;
                }
            }
            
            this.byId("codephone_collab").setText(sSelectedKey)
        },


        // Export Section

        /* createColumnConfig: function() {
			return [
				{
					label: 'User ID',
					property: 'UserID',
					type: EdmType.Number,
					scale: 0
				},
				{
					label: 'Collaborateur',
                    property: ['Nom', 'Prenom'],
					width: '25'
				},
				{
					label: 'Type',
					property: 'Type',
					width: '25'
				},
                {
					label: 'Agence',
					property: 'Agence',
					width: '25'
				},
                {
					label: 'Pole',
					property: 'Pole',
					width: '25'
				},
                {
					label: 'Etat',
					property: 'Etat',
					width: '25'
				},
				 {
					label: 'Salary',
					property: 'Salary',
					type: EdmType.Currency,
					unitProperty: 'Currency',
					width: '18'
				}, 
				{
					label: 'Active',
					property: 'Active',
					type: EdmType.String
				} ];
		}, */

    /*      onExport: function() {
                var aCols, oBinding, oSettings, oSheet, oTable;

                oTable = this.byId('collabTable');
                oBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: oBinding
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function() {
                        MessageToast.show('Spreadsheet export has finished');
                    }).finally(function() {
                        oSheet.destroy();
                    });
            }, */

        // Visibility Sections       

        onBack (sectionOne,sectionTwo)
        {
            this.getView().byId(sectionOne).setVisible(false);
            this.getView().byId(sectionTwo).setVisible(true);
        }

    });
});