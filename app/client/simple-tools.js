Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) { // This code only runs on the client

	Meteor.subscribe("tasks");
	//Meteor.subscribe("filteredTasks");

	getPublicPrivateFilter = new function () {
			var test = null; 
			var hidePub = Session.get("hidePublic");
			var hidePriv = Session.get("hidePrivate");
			if(hidePub ==undefined && hidePriv == undefined) {
				test = ''; 
			} else {
				if (hidePriv=== true) {
					test = hidePriv;
				} else {
					test = !hidePub;
				}
			}
			
			return test;
	};
	
	Template.body.helpers({
		
		tasks : function () {
			var test = null; 
			var hidePub = Session.get("hidePublic");
			var hidePriv = Session.get("hidePrivate");
			var incompleteCount = Session.get("IncompleteCount");
			if(hidePub ==undefined && hidePriv == undefined) {
				test = ''; 
			} else {
				if (hidePriv=== true) {
					test = hidePriv;
				} else {
					test = !hidePub;
				}
			}
			
			//  Where do I put helper/utility methods so I don't repeat code?
			//  Is it possible to access methods in other objects/scopes?
			//  I don't want to repeat the code above for each find() call see incompleteCount()
			
			//test = getPublicPrivateFilter();	
				
			if (Session.get("hideCompleted")) {
				return Tasks.find({
					checked : {
						$ne : Session.get("hideCompleted")
					},
					private : {
						$ne : test
					}
				}, {
					sort : {
						createdAt : -1
					}, limit :10
				});
			} else {
				return Tasks.find({
					private : {
						$ne : test
					}
				}, {
					sort : {
						createdAt : -1
					}, 
					limit:10
				});
			}
		},
		hideCompleted : function () {
			return Session.get("hideCompleted");
		},
		incompleteCount : function () {
			var test = null; 
			var hidePub = Session.get("hidePublic");
			var hidePriv = Session.get("hidePrivate");
			if(hidePub ==undefined && hidePriv == undefined) {
				test = ''; 
			} else {
				if (hidePriv=== true) {
					test = hidePriv;
				} else {
					test = !hidePub;
				}
			}	
			
			return Tasks.find({
				private : {
						$ne : test
				},
				checked : {
					$ne : true
				}
			}).count();
		},
	});

	Template.body.events({
		"submit .new-task" : function (event) {
			event.preventDefault();

			var text = event.target.text.value;

			Meteor.call("addTask", text);

			event.target.text.value = "";
		},
		"click .hide-completed" : function (event, target) {
				Session.set("hideCompleted", event.target.checked);
		},
		"click .hide-public" : function (event, target) {
			Session.set("hidePublic", event.target.checked);
			Session.set("hidePrivate", false);			
		},
		"click .hide-private" : function (event, target) {
			Session.set("hidePrivate", event.target.checked);
			Session.set("hidePublic", false);
		},
		"click .count-clicked" :  function (event) {
			Meteor.call('getTaskCount', {}, (err, res) => {
				if(err)	 {
					alert(err);
				} else {
					alert("Total Tasks: "+ res);
				}
			});
		},
		"click show-more"  : function(event) {
			//again... where is it best for this common helper to reside 
			//and how is it called from the other blocks of code?
			var test = null; 
			var hidePub = Session.get("hidePublic");
			var hidePriv = Session.get("hidePrivate");
			var incompleteCount = Session.get("IncompleteCount");
			var hideCompleted = Session.get("hideCompleted");
			if(hidePub ==undefined && hidePriv == undefined) {
				test = ''; 
			} else {
				if (hidePriv=== true) {
					test = hidePriv;
				} else {
					test = !hidePub;
				}
			}
			Meteor.call('getAllTasks', {hideCompleted, test}, (err, res) => {
				if(err)	 {
					
				} else {
					
				}
			});
		}
	});

	Template.task.helpers({
		
		isOwner : function () {
			return this.owner === Meteor.userId();
		}
	});

	Template.task.events({
		"click .toggle-checked" : function () {
			Meteor.call("setChecked", this._id, !this.checked);
		},
		"click .delete" : function () {
			Meteor.call("deleteTask", this._id);
		},
		"click .toggle-private" : function () {
			Meteor.call("setPrivate", this._id, !this.private);
		}
	});

	Accounts.ui.config({
		passwordSignupFields : "USERNAME_ONLY"
	});
}
