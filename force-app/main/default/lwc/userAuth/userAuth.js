import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserAuth extends LightningElement {
    @track activeTab = 'login'; // 'login', 'signup', 'forgot'

    // Login Form State
    @track loginEmail = '';
    @track loginPassword = '';

    // Signup Form State
    @track signupName = '';
    @track signupEmail = '';
    @track signupPassword = '';
    @track signupConfirmPassword = '';

    // Forgot Password Form State
    @track forgotEmail = '';

    get isLogin() {
        return this.activeTab === 'login';
    }

    get isSignup() {
        return this.activeTab === 'signup';
    }

    get isForgot() {
        return this.activeTab === 'forgot';
    }

    handleTabSelect(event) {
        this.activeTab = event.target.value;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field) {
            this[field] = event.target.value;
        }
    }

    handleLoginSubmit() {
        if (!this.loginEmail || !this.loginPassword) {
            this.showToast('Error', 'Please enter email and password', 'error');
            return;
        }
        this.showToast('Success', 'Login request processed for ' + this.loginEmail, 'success');
    }

    handleSignupSubmit() {
        if (!this.signupName || !this.signupEmail || !this.signupPassword) {
            this.showToast('Error', 'Please fill in all required fields', 'error');
            return;
        }
        if (this.signupPassword !== this.signupConfirmPassword) {
            this.showToast('Error', 'Passwords do not match', 'error');
            return;
        }
        this.showToast('Success', 'Account created successfully for ' + this.signupEmail, 'success');
    }

    handleForgotSubmit() {
        if (!this.forgotEmail) {
            this.showToast('Error', 'Please enter your email address', 'error');
            return;
        }
        this.showToast('Info', 'Password reset instructions sent to ' + this.forgotEmail, 'info');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
