public with sharing class PlanController {

    @AuraEnabled(cacheable=true)
    public static List<Plan__c> getAllPlans() {
        return [SELECT Id, Name, Price__c, Duration__c, Discount__c, RatingsAverage__c FROM Plan__c WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static Plan__c getPlan(Id planId) {
        return [SELECT Id, Name, Price__c, Duration__c, Discount__c, RatingsAverage__c FROM Plan__c WHERE Id = :planId WITH SECURITY_ENFORCED LIMIT 1];
    }

    @AuraEnabled
    public static Plan__c createPlan(Plan__c plan) {
        insert plan;
        return plan;
    }

    @AuraEnabled
    public static Plan__c updatePlan(Plan__c plan) {
        update plan;
        return plan;
    }

    @AuraEnabled
    public static void deletePlan(Id planId) {
        Plan__c planToDelete = [SELECT Id FROM Plan__c WHERE Id = :planId WITH SECURITY_ENFORCED LIMIT 1];
        delete planToDelete;
    }

    @AuraEnabled(cacheable=true)
    public static List<Plan__c> top3Plans() {
        return [SELECT Id, Name, Price__c, Duration__c, Discount__c, RatingsAverage__c FROM Plan__c WITH SECURITY_ENFORCED ORDER BY RatingsAverage__c DESC NULLS LAST LIMIT 3];
    }
}
