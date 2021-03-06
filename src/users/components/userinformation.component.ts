import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { UserState, getCurrentUser, EditUser, getUserWithUsername } from '../store';
import { NgForm } from '@angular/forms';
import { ShoppingCartState, EditCartUser } from '../../shoppingcart/store';

@Component({
    selector: 'userinformation',
    templateUrl: 'userinformation.component.html'
})

export class UserInformationComponent implements OnInit {
    
    isEditing : boolean = false;
    users : User[];
    user : User; 
    modelUser : User;
    
    constructor(
        private store : Store<UserState | ShoppingCartState>
    ) { }

    ngOnInit() {
        this.store.select (getCurrentUser).subscribe(user => this.user = user);
        this.modelUser = this.user;
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;   
    }

    onSubmit(ngForm : NgForm) {

        let testuserusername : User; 
        this.store.select (getUserWithUsername(this.modelUser.username)).subscribe (user => testuserusername = user);

        if (testuserusername != null && testuserusername.id != this.user.id) {
            window.alert ("Username is taken");
            return;
        }

        if (ngForm.invalid == true ) {
            window.alert ("Please fill out all of the boxes");
            return;
        }

        // Edit the User
        this.store.dispatch ( new EditUser(this.modelUser));

        // Also update the current user in cart
        this.store.dispatch ( new EditCartUser(this.modelUser));

        this.toggleEdit();
    }
    
}