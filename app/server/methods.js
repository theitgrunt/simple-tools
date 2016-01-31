
Meteor.methods({

	getTaskCount : function () {
		const count = Tasks.find({}, {
				sort : {
					createdAt : -1
				}
			}).count();
		if (count === -1) {
			throw new Meteor.Error('No tasks created');
		} else {
			return count;
		}
	},

	addTask : function (text) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.insert({
			text : text,
			createdAt : new Date(),
			owner : Meteor.userId(),
			username : Meteor.user().username
		});
	},
	deleteTask : function (taskId) {
		var task = Tasks.findOne(taskId);

		if (task.private && task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.remove(taskId);
	},

	setChecked : function (taskId, setChecked) {
		var task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.update(taskId, {
			$set : {
				checked : setChecked
			}
		});
	},
	setPrivate : function (taskId, setToPrivate) {
		var task = Tasks.findOne(taskId);

		if (task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.update(taskId, {
			$set : {
				private : setToPrivate
			}
		});
	}
});
