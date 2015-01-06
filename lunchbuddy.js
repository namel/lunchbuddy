var Bunch = new Mongo.Collection("bunch");

if (Meteor.isClient) {

  // BODY helpers and events
  Template.body.helpers({
     teamName: function() { return Session.get("teamName"); },
     bunch: function() { return Bunch.find({ team: Session.get("teamName")}); },
     startNewBunch: function() { return Session.get("startNewBunch"); }
  });
  Template.body.events({
     "submit .team-name": function(event) { 
         Session.set("teamName", event.target.teamName.value); 
         event.target.teamName.value = "";
         return false;
     },
     "click .leave": function(event) { Session.set("teamName", null); },
     "click .new-bunch-button": function(event) { Session.set("startNewBunch", true); },
     "submit .new-bunch": function(event) {
         if (event.target[0].value === "") return false;
         if (event.target[1].value === "") return false;
         var newBunch = { 
             team: Session.get("teamName"), 
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
     members: function() { return this.members; },
     isEmpty: function() { return this.members.length === 0; }
  });
  Template.bunchTemplate.events({
     "submit .new-member": function(event) {
         this.members.push(event.target.newGuy.value);
         Bunch.update(this._id, { $addToSet: {members: event.target.newGuy.value}});
         event.target.newGuy.value = "";
         return false;
     },
     "click .delete": function(event) { Bunch.remove(this._id); }
  });

  // MEMBER helpers and events
  Template.memberTemplate.helpers({ member: function() { return this; } });
  Template.memberTemplate.events({
     "click .delete": function(event) {
        var bunch_id = $(event.target).parent().parent().parent().parent().attr('bunch_id');
        var bunch = Bunch.findOne({_id:bunch_id});
        var removeIndex = bunch.members.indexOf(this.toString());
        if (removeIndex < 0) return;
        bunch.members.splice(removeIndex, 1);
        Bunch.update(bunch._id, bunch);
     }
  });
}

