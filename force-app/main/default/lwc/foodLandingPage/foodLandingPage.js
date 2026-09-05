import { LightningElement, wire, track } from 'lwc';
import getAllPlans from '@salesforce/apex/PlanController.getAllPlans';
import getAllReviews from '@salesforce/apex/ReviewController.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class FoodLandingPage extends NavigationMixin(LightningElement) {
    @track topPlans = [];
    @track topReviews = [];

    @wire(getAllPlans)
    wiredPlans({ error, data }) {
        if (data) {
            // Sort by RatingsAverage__c descending and pick top 3
            this.topPlans = [...data]
                .sort((a, b) => (b.RatingsAverage__c || 0) - (a.RatingsAverage__c || 0))
                .slice(0, 3);
        }
    }

    @wire(getAllReviews)
    wiredReviews({ error, data }) {
        if (data) {
            this.topReviews = [...data]
                .sort((a, b) => (b.Rating__c || 0) - (a.Rating__c || 0))
                .slice(0, 3);
        }
    }

    navigateToPlans() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Plan__c',
                actionName: 'list'
            }
        });
    }

    navigateToPlanDetail(event) {
        const planId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: planId,
                objectApiName: 'Plan__c',
                actionName: 'view'
            }
        });
    }
}
