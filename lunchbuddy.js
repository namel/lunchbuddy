var Bunch = new Mongo.Collection("bunch");

if (Meteor.isClient) {

  // BODY helpers and events
  Template.body.helpers({
     bunch: function() { return Bunch.find(); },
     startNewBunch: function() { return Session.get("startNewBunch"); }
  });
  Template.body.events({
     "click .new-bunch-button": function(event) { Session.set("startNewBunch", true); },
     "submit .new-bunch": function(event) { 
         var newBunch = { 
             team: "interlude", 
             restaurant: event.target[0].value,
             time: event.target[1].value,
             members: []
         };
         event.target[0].value = "";
         event.target[1].value = "";
         Session.set("startNewBunch", false);
         Bunch.insert(newBunch);
         return false; 
     }
  });

  // BUNCH helpers and events
  Template.bunchTemplate.helpers({
     restaurant: function() { return this.restaurant; },
     time: function() { return this.time; },
     members: function() { return this.members; }
  });
  Template.bunchTemplate.events({
     "submit .new-member": function(event) {
         this.members.push(event.target.newGuy.value);
         Bunch.update(this._id, { $addToSet: {members: event.target.newGuy.value}});
         event.target.newGuy.value = "";
         return false;
     }
  });

  // MEMBER helpers and events
  Template.memberTemplate.helpers({
     member: function() { return this; }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
