import { Component, OnInit } from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import { ContactsService } from "../services/contacts.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Contact } from '../models/contact.model';
import { switchMap } from "rxjs/operators"

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  
  animations: [
    // trigger('openClose', [
    //   // ...
    //   state('open', style({
    //     opacity: 1,
    //   })),
    //   state('closed', style({
    //     opacity: 0.5,
    //   })),
    //   transition('open => closed', [
    //     animate('1s')
    //   ]),
    //   transition('closed => open', [
    //     animate('0.5s')
    //   ]),
    // ]),
    
      trigger(
        'slideLeftAnimation', [
          transition(':enter', [
            style({transform: 'translateX(100%)', opacity: 0}),
            animate('200ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
          ]),
          transition(':leave', [
            style({transform: 'translateX(0)', opacity: 1}),
            animate('200ms ease-out', style({transform: 'translateX(-100%)', opacity: 0}))
          ])
        ]
      )
  ],

})

export class DetailsComponent implements OnInit {
  // Les données
  details:Contact; // L'objet Contact sélectionné par l'utilisateur
  id;
  constructor(private contactService:ContactsService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    /* LE SNAPSHOT DE L'URL */
    //this.id = this.route.snapshot.paramMap.get('id');
    // console.log( this.id);

    /* LE SUBSCRIBE DE L'URL */

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id");
      console.log(this.id);
      this.contactService.contactsSubject.subscribe(data => {
        this.details = data.filter(contact=> contact.id ===  this.id)[0];
       })
       console.log(this.details);
    })

    

    

    /* Si Les données sont vides alors on reroute sur la page qui liste les contacts*/
    /* PS : les routes sont enregistrées dans src/app/app.module.ts */
    if(! this.id || this.details == undefined) {
      this.router.navigate(['/']);
    }   
  } // FIn ngOnInit


}
