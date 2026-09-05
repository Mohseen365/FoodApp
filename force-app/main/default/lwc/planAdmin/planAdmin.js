import { LightningElement, wire, track } from 'lwc';
import getAllPlans from '@salesforce/apex/PlanController.getAllPlans';
import createPlan from '@salesforce/apex/PlanController.createPlan';
import updatePlan from '@salesforce/apex/PlanController.updatePlan';
import deletePlan from '@salesforce/apex/PlanController.deletePlan';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PlanAdmin extends LightningElement {
    @track plans = [];
    @track isLoading = false;
    @track isModalOpen = false;
    @track modalTitle = 'Create Plan';

    @track currentPlanId = null;
    @track planName = '';
    @track planPrice = '';
    @track planDuration = '';
    @track planDiscount = '';

    @wire(getAllPlans)
    wiredPlans({ error, data }) {
        if (data) {
            this.plans = data;
        } else if (error) {
            this.showToast('Error', 'Failed to fetch plans', 'error');
        }
    }

    openCreateModal() {
        this.currentPlanId = null;
        this.planName = '';
        this.planPrice = '';
        this.planDuration = '';
        this.planDiscount = '';
        this.modalTitle = 'Create New Plan';
        this.isModalOpen = true;
    }

    openEditModal(event) {
        const planId = event.target.dataset.id;
        const selected = this.plans.find(p => p.Id === planId);
        if (selected) {
            this.currentPlanId = selected.Id;
            this.planName = selected.Name;
            this.planPrice = selected.Price__c;
            this.planDuration = selected.Duration__c;
            this.planDiscount = selected.Discount__c || '';
            this.modalTitle = 'Edit Plan: ' + selected.Name;
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    async handleSavePlan() {
        if (!this.planName || !this.planPrice || !this.planDuration) {
            this.showToast('Warning', 'Please fill in required fields (Name, Price, Duration)', 'warning');
            return;
        }

        this.isLoading = true;
        try {
            const planObj = {
                sobjectType: 'Plan__c',
                Name: this.planName,
                Price__c: parseFloat(this.planPrice),
                Duration__c: parseInt(this.planDuration, 10),
                Discount__c: this.planDiscount ? parseFloat(this.planDiscount) : null
            };

            if (this.currentPlanId) {
                planObj.Id = this.currentPlanId;
                await updatePlan({ plan: planObj });
                this.showToast('Success', 'Plan updated successfully', 'success');
            } else {
                await createPlan({ plan: planObj });
                this.showToast('Success', 'Plan created successfully', 'success');
            }

            this.closeModal();
            const refreshed = await getAllPlans();
            this.plans = refreshed;
        } catch (err) {
            this.showToast('Error', err.body ? err.body.message : err.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async handleDeletePlan(event) {
        const planId = event.target.dataset.id;
        this.isLoading = true;
        try {
            await deletePlan({ planId: planId });
            this.showToast('Success', 'Plan deleted successfully', 'success');
            const refreshed = await getAllPlans();
            this.plans = refreshed;
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
