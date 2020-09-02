import { Component, OnInit, Output,  Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ContactsService } from '../services/contacts.service'

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  form: FormGroup;
  contacts;
  textAddOrUpdate;
  submitted:boolean = false;

  @Input() contact;
  @Input() contactIndex;
  /*
  @Output est le décorateur qui permet de transmettre de l'information à notre component parent
  */
  @Output() public addEvent: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(private formBuilder:FormBuilder, private contactService:ContactsService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title:['', [Validators.required]],
      first:['', [Validators.required, Validators.minLength(2)]],
      last:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.email]],
      cell:'',
      address:'',
      cp:'', 
      city:'',
    });
    console.log(this.contactIndex);
    if(this.contact) {
      this.form.controls['title'].setValue(this.contact.name.title);
      this.form.controls['first'].setValue(this.contact.name.first);
      this.form.controls['last'].setValue(this.contact.name.last);
      this.form.controls['email'].setValue(this.contact.email);
      this.form.controls['cell'].setValue(this.contact.cell);

      this.textAddOrUpdate = "Mettre à jour"
    }
    else {
      this.textAddOrUpdate = "Ajouter"
    }
    
  }

  addContactAction(contact) {
     this.submitted = true;
     // stop here if form is invalid
     if (this.form.invalid) {
      return;
    }

    console.log(contact);
    this.form.reset();
    this.addEvent.emit(contact);
    // addEvent est l'event de type EventEmitter qui dispose de la méthode emit
    // contact est l'information qui sera transmise
  }

}
