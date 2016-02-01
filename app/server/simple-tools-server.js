Tasks = new Mongo.Collection("tasks");

if(Meteor.isServer) {
	Meteor.publish("tasks", function() {
	
		return Tasks.find({
			$or : [
				{ private: {$ne:true}},
				{owner: this.userId},
			]
		});
	});
	
//	Meteor.publish("filteredTasks", function(showPrivate) {
	
//		return Tasks.find({
//			$or : [
//				{ private: {$ne:showPrivate}},
//				{owner: this.userId},
//			]
//		});
//	});
}
