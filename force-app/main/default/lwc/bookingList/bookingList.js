import { LightningElement, wire, track } from 'lwc';
import getAllBookings from '@salesforce/apex/BookingController.getAllBookings';
import deleteBooking from '@salesforce/apex/BookingController.deleteBooking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BookingList extends LightningElement {
    @track bookings = [];
    @track isLoading = false;

    @wire(getAllBookings)
    wiredBookings({ error, data }) {
        if (data) {
            this.bookings = data;
        } else if (error) {
            this.showToast('Error', 'Failed to fetch bookings', 'error');
        }
    }

    async handleCancelBooking(event) {
        const bookingId = event.target.dataset.id;
        this.isLoading = true;
        try {
            await deleteBooking({ bookingId: bookingId });
            this.showToast('Success', 'Booking cancelled successfully', 'success');
            const updated = await getAllBookings();
            this.bookings = updated;
        } catch (err) {
            this.showToast('Error', err.body ? err.body.message : err.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
