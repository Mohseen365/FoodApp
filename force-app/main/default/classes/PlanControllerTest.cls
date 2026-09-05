@isTest
private class PlanControllerTest {

    @testSetup
    static void setupData() {
        List<Plan__c> testPlans = new List<Plan__c>();
        testPlans.add(new Plan__c(Name = 'Plan 1', Price__c = 100, Duration__c = 30, RatingsAverage__c = 4.5));
        testPlans.add(new Plan__c(Name = 'Plan 2', Price__c = 200, Duration__c = 60, RatingsAverage__c = 4.8));
        testPlans.add(new Plan__c(Name = 'Plan 3', Price__c = 300, Duration__c = 90, RatingsAverage__c = 4.2));
        testPlans.add(new Plan__c(Name = 'Plan 4', Price__c = 400, Duration__c = 120, RatingsAverage__c = 3.9));
        insert testPlans;
    }

    @isTest
    static void testGetAllPlans() {
        Test.startTest();
        List<Plan__c> plans = PlanController.getAllPlans();
        Test.stopTest();
        System.assertEquals(4, plans.size(), 'Should retrieve all 4 plans');
    }

    @isTest
    static void testGetPlan() {
        Plan__c expectedPlan = [SELECT Id, Name FROM Plan__c WHERE Name = 'Plan 1' LIMIT 1];
        Test.startTest();
        Plan__c actualPlan = PlanController.getPlan(expectedPlan.Id);
        Test.stopTest();
        System.assertEquals('Plan 1', actualPlan.Name, 'Should match Plan 1');
    }

    @isTest
    static void testCreatePlan() {
        Plan__c newPlan = new Plan__c(Name = 'Plan New', Price__c = 150, Duration__c = 30);
        Test.startTest();
        Plan__c createdPlan = PlanController.createPlan(newPlan);
        Test.stopTest();
        System.assertNotEquals(null, createdPlan.Id, 'Plan should be inserted and have an Id');
    }

    @isTest
    static void testUpdatePlan() {
        Plan__c plan = [SELECT Id, Price__c FROM Plan__c WHERE Name = 'Plan 1' LIMIT 1];
        plan.Price__c = 125;
        Test.startTest();
        Plan__c updatedPlan = PlanController.updatePlan(plan);
        Test.stopTest();
        System.assertEquals(125, updatedPlan.Price__c, 'Price should be updated');
    }

    @isTest
    static void testDeletePlan() {
        Plan__c plan = [SELECT Id FROM Plan__c WHERE Name = 'Plan 4' LIMIT 1];
        Test.startTest();
        PlanController.deletePlan(plan.Id);
        Test.stopTest();
        List<Plan__c> remaining = [SELECT Id FROM Plan__c WHERE Id = :plan.Id];
        System.assertEquals(0, remaining.size(), 'Plan should be deleted');
    }

    @isTest
    static void testTop3Plans() {
        Test.startTest();
        List<Plan__c> topPlans = PlanController.top3Plans();
        Test.stopTest();
        System.assertEquals(3, topPlans.size(), 'Should return top 3 plans');
        System.assertEquals('Plan 2', topPlans[0].Name, 'Highest rated plan should be first');
    }
}
