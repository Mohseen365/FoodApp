import { LightningElement, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import USERNAME_FIELD from '@salesforce/schema/User.Username';
import TITLE_FIELD from '@salesforce/schema/User.Title';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/User.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserProfile extends LightningElement {
    userId = USER_ID;
    @track name;
    @track email;
    @track title;
    @track username;
    @track isLoading = false;

    @wire(getRecord, { recordId: '$userId', fields: [NAME_FIELD, EMAIL_FIELD, USERNAME_FIELD, TITLE_FIELD] })
    wiredUser({ error, data }) {
        if (data) {
            this.name = data.fields.Name.value;
            this.email = data.fields.Email.value;
            this.username = data.fields.Username.value;
            this.title = data.fields.Title.value;
        } else if (error) {
            this.showToast('Error', 'Failed to fetch user details', 'error');
        }
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleTitleChange(event) {
        this.title = event.target.value;
    }

    async handleUpdateProfile() {
        this.isLoading = true;
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.userId;
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[EMAIL_FIELD.fieldApiName] = this.email;
        fields[TITLE_FIELD.fieldApiName] = this.title;

        const recordInput = { fields };

        try {
            await updateRecord(recordInput);
            this.showToast('Success', 'User profile updated successfully', 'success');
        } catch (error) {
            this.showToast('Error', error.body ? error.body.message : error.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
