public with sharing class ReviewController {

    @AuraEnabled(cacheable=true)
    public static List<Review__c> getAllReviews() {
        return [SELECT Id, Name, Rating__c, Review__c, Plan__c, Plan__r.Name, User__c, User__r.Name FROM Review__c WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static Review__c getReview(Id reviewId) {
        return [SELECT Id, Name, Rating__c, Review__c, Plan__c, Plan__r.Name, User__c, User__r.Name FROM Review__c WHERE Id = :reviewId WITH SECURITY_ENFORCED LIMIT 1];
    }

    @AuraEnabled
    public static Review__c createReview(Review__c review) {
        insert review;
        return review;
    }

    @AuraEnabled
    public static Review__c updateReview(Review__c review) {
        update review;
        return review;
    }

    @AuraEnabled
    public static void deleteReview(Id reviewId) {
        Review__c reviewToDelete = [SELECT Id FROM Review__c WHERE Id = :reviewId WITH SECURITY_ENFORCED LIMIT 1];
        delete reviewToDelete;
    }

    @AuraEnabled(cacheable=true)
    public static List<Review__c> getPlanReviews(Id planId) {
        return [SELECT Id, Name, Rating__c, Review__c, User__c, User__r.Name FROM Review__c WHERE Plan__c = :planId WITH SECURITY_ENFORCED];
    }
}
