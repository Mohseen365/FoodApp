@isTest
private class BookingControllerTest {

    @testSetup
    static void setupData() {
        Plan__c plan = new Plan__c(Name = 'Test Plan', Price__c = 100, Duration__c = 30);
        insert plan;

        Booking__c booking = new Booking__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Price__c = 100,
            Status__c = 'Pending'
        );
        insert booking;
    }

    @isTest
    static void testGetAllBookings() {
        Test.startTest();
        List<Booking__c> bookings = BookingController.getAllBookings();
        Test.stopTest();
        System.assertEquals(1, bookings.size(), 'Should retrieve 1 booking');
    }

    @isTest
    static void testGetBooking() {
        Booking__c expectedBooking = [SELECT Id FROM Booking__c LIMIT 1];
        Test.startTest();
        Booking__c actualBooking = BookingController.getBooking(expectedBooking.Id);
        Test.stopTest();
        System.assertEquals(expectedBooking.Id, actualBooking.Id, 'Should match requested booking Id');
    }

    @isTest
    static void testCreateBooking() {
        Plan__c plan = [SELECT Id FROM Plan__c LIMIT 1];
        Booking__c newBooking = new Booking__c(
            Plan__c = plan.Id,
            User__c = UserInfo.getUserId(),
            Price__c = 200,
            Status__c = 'Confirmed'
        );
        Test.startTest();
        Booking__c created = BookingController.createBooking(newBooking);
        Test.stopTest();
        System.assertNotEquals(null, created.Id, 'Booking should be inserted');
    }

    @isTest
    static void testDeleteBooking() {
        Booking__c booking = [SELECT Id FROM Booking__c LIMIT 1];
        Test.startTest();
        BookingController.deleteBooking(booking.Id);
        Test.stopTest();
        List<Booking__c> remaining = [SELECT Id FROM Booking__c WHERE Id = :booking.Id];
        System.assertEquals(0, remaining.size(), 'Booking should be deleted');
    }
}
