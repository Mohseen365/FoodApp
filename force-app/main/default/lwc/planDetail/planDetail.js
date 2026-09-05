import { LightningElement, api, wire, track } from 'lwc';
import getPlan from '@salesforce/apex/PlanController.getPlan';
import getAllReviews from '@salesforce/apex/ReviewController.getAllReviews';
import createReview from '@salesforce/apex/ReviewController.createReview';
import deleteReview from '@salesforce/apex/ReviewController.deleteReview';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id';

export default class PlanDetail extends LightningElement {
    @api recordId; // Plan__c Record Id
    @track plan;
    @track reviews = [];
    @track reviewText = '';
    @track ratingValue = '5';
    @track isLoading = false;

    get ratingOptions() {
        return [
            { label: '5 - Excellent', value: '5' },
            { label: '4 - Very Good', value: '4' },
            { label: '3 - Good', value: '3' },
            { label: '2 - Poor', value: '2' },
            { label: '1 - Very Poor', value: '1' }
        ];
    }

    @wire(getPlan, { planId: '$recordId' })
    wiredPlan({ error, data }) {
        if (data) {
            this.plan = data;
        } else if (error) {
            this.showToast('Error', 'Failed to load plan details', 'error');
        }
    }

    @wire(getAllReviews)
    wiredReviews({ error, data }) {
        if (data) {
            this.reviews = data.filter(r => r.Plan__c === this.recordId);
        } else if (error) {
            this.showToast('Error', 'Failed to load reviews', 'error');
        }
    }

    handleReviewChange(event) {
        this.reviewText = event.target.value;
    }

    handleRatingChange(event) {
        this.ratingValue = event.target.value;
    }

    async handleAddReview() {
        if (!this.reviewText) {
            this.showToast('Warning', 'Please enter a review message', 'warning');
            return;
        }

        this.isLoading = true;
        try {
            const newReview = {
                sobjectType: 'Review__c',
                Plan__c: this.recordId,
                User__c: USER_ID,
                Review__c: this.reviewText,
                Rating__c: parseFloat(this.ratingValue)
            };
            await createReview({ review: newReview });
            this.showToast('Success', 'Review submitted successfully', 'success');
            this.reviewText = '';
            // Refresh reviews
            const updated = await getAllReviews();
            this.reviews = updated.filter(r => r.Plan__c === this.recordId);
        } catch (err) {
            this.showToast('Error', err.body ? err.body.message : err.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async handleDeleteReview(event) {
        const reviewId = event.target.dataset.id;
        this.isLoading = true;
        try {
            await deleteReview({ reviewId: reviewId });
            this.showToast('Success', 'Review deleted', 'success');
            const updated = await getAllReviews();
            this.reviews = updated.filter(r => r.Plan__c === this.recordId);
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
