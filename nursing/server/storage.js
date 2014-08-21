JournalDocuments = new FS.Collection("journalDocuments", {
	stores : [new FS.Store.FileSystem("journalDocuments")]
});

FS.HTTP.setBaseUrl('/attachments');

Meteor.publish('journalDocuments', function(criteria, projection) {
	if (this.userId) {
		return JournalDocuments.find();
	} else {
		return null;
	}
});