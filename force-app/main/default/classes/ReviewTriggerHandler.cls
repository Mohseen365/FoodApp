public with sharing class ReviewTriggerHandler {

    public static void updatePlanRatings(List<Review__c> reviews) {
        Set<Id> planIds = new Set<Id>();
        for (Review__c rev : reviews) {
            if (rev.Plan__c != null) {
                planIds.add(rev.Plan__c);
            }
        }

        if (planIds.isEmpty()) {
            return;
        }

        List<AggregateResult> results = [
            SELECT Plan__c, AVG(Rating__c) avgRating
            FROM Review__c
            WHERE Plan__c IN :planIds
            WITH SECURITY_ENFORCED
            GROUP BY Plan__c
        ];

        Map<Id, Decimal> planToAvgRating = new Map<Id, Decimal>();
        for (AggregateResult ar : results) {
            Id planId = (Id) ar.get('Plan__c');
            Decimal avgRating = (Decimal) ar.get('avgRating');
            planToAvgRating.put(planId, avgRating);
        }

        List<Plan__c> plansToUpdate = new List<Plan__c>();
        for (Id pId : planIds) {
            Decimal newAvg = planToAvgRating.containsKey(pId) ? planToAvgRating.get(pId) : 0;
            plansToUpdate.add(new Plan__c(
                Id = pId,
                RatingsAverage__c = newAvg
            ));
        }

        if (!plansToUpdate.isEmpty()) {
            update plansToUpdate;
        }
    }
}
