@isTest
private class ReviewControllerTest {

    @testSetup
    static void setupData() {
        Plan__c plan = new Plan__c(Name = 'Test Plan', Price__c = 100, Duration__c = 30);
        insert plan;

        Review__c review = new Review__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Rating__c = 5,
            Review__c = 'Great plan!'
        );
        insert review;
    }

    @isTest
    static void testGetAllReviews() {
        Test.startTest();
        List<Review__c> reviews = ReviewController.getAllReviews();
        Test.stopTest();
        System.assertEquals(1, reviews.size(), 'Should retrieve 1 review');
    }

    @isTest
    static void testGetReview() {
        Review__c expectedReview = [SELECT Id FROM Review__c LIMIT 1];
        Test.startTest();
        Review__c actualReview = ReviewController.getReview(expectedReview.Id);
        Test.stopTest();
        System.assertEquals(expectedReview.Id, actualReview.Id, 'Should match requested review Id');
    }

    @isTest
    static void testCreateReview() {
        Plan__c plan = [SELECT Id FROM Plan__c LIMIT 1];
        Review__c newReview = new Review__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Rating__c = 4,
            Review__c = 'Good experience'
        );
        Test.startTest();
        Review__c created = ReviewController.createReview(newReview);
        Test.stopTest();
        System.assertNotEquals(null, created.Id, 'Review should be inserted');
    }

    @isTest
    static void testUpdateReview() {
        Review__c review = [SELECT Id, Rating__c FROM Review__c LIMIT 1];
        review.Rating__c = 4;
        Test.startTest();
        Review__c updated = ReviewController.updateReview(review);
        Test.stopTest();
        System.assertEquals(4, updated.Rating__c, 'Rating should be updated');
    }

    @isTest
    static void testDeleteReview() {
        Review__c review = [SELECT Id FROM Review__c LIMIT 1];
        Test.startTest();
        ReviewController.deleteReview(review.Id);
        Test.stopTest();
        List<Review__c> remaining = [SELECT Id FROM Review__c WHERE Id = :review.Id];
        System.assertEquals(0, remaining.size(), 'Review should be deleted');
    }

    @isTest
    static void testGetPlanReviews() {
        Plan__c plan = [SELECT Id FROM Plan__c LIMIT 1];
        Test.startTest();
        List<Review__c> planReviews = ReviewController.getPlanReviews(plan.Id);
        Test.stopTest();
        System.assertEquals(1, planReviews.size(), 'Should return 1 review for plan');
    }
}
