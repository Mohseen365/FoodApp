trigger ReviewTrigger on Review__c (after insert, after update, after delete, after undelete) {
    List<Review__c> affectedReviews = Trigger.isDelete ? Trigger.old : Trigger.new;
    ReviewTriggerHandler.updatePlanRatings(affectedReviews);
}
