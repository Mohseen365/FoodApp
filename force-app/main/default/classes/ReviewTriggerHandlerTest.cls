@isTest
private class ReviewTriggerHandlerTest {

    @isTest
    static void testReviewTriggerRatingCalculation() {
        Plan__c plan = new Plan__c(Name = 'Test Plan Ratings', Price__c = 100, Duration__c = 30);
        insert plan;

        Review__c rev1 = new Review__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Rating__c = 5,
            Review__c = 'Excellent'
        );
        Test.startTest();
        insert rev1;
        Test.stopTest();

        Plan__c updatedPlan = [SELECT Id, RatingsAverage__c FROM Plan__c WHERE Id = :plan.Id];
        System.assertEquals(5.0, updatedPlan.RatingsAverage__c, 'Rating average should be 5.0 after 1st review');

        Review__c rev2 = new Review__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Rating__c = 3,
            Review__c = 'Average'
        );
        insert rev2;

        updatedPlan = [SELECT Id, RatingsAverage__c FROM Plan__c WHERE Id = :plan.Id];
        System.assertEquals(4.0, updatedPlan.RatingsAverage__c, 'Rating average should be 4.0 after 2nd review');

        delete rev2;
        updatedPlan = [SELECT Id, RatingsAverage__c FROM Plan__c WHERE Id = :plan.Id];
        System.assertEquals(5.0, updatedPlan.RatingsAverage__c, 'Rating average should be 5.0 after deleting 2nd review');
    }
}
