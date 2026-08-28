import { LightningElement, wire, track } from 'lwc';
import getAllPlans from '@salesforce/apex/PlanController.getAllPlans';

export default class PlanList extends LightningElement {
    @track plans;
    @track error;

    @wire(getAllPlans)
    wiredPlans({ error, data }) {
        if (data) {
            this.plans = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.plans = undefined;
        }
    }
}
