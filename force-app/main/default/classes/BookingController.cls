public with sharing class BookingController {

    @AuraEnabled(cacheable=true)
    public static List<Booking__c> getAllBookings() {
        return [SELECT Id, Name, Plan__c, Plan__r.Name, User__c, User__r.Name, Price__c, Status__c FROM Booking__c WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static Booking__c getBooking(Id bookingId) {
        return [SELECT Id, Name, Plan__c, Plan__r.Name, User__c, User__r.Name, Price__c, Status__c FROM Booking__c WHERE Id = :bookingId WITH SECURITY_ENFORCED LIMIT 1];
    }

    @AuraEnabled
    public static Booking__c createBooking(Booking__c booking) {
        insert booking;
        return booking;
    }

    @AuraEnabled
    public static void deleteBooking(Id bookingId) {
        Booking__c bookingToDelete = [SELECT Id FROM Booking__c WHERE Id = :bookingId WITH SECURITY_ENFORCED LIMIT 1];
        delete bookingToDelete;
    }
}
