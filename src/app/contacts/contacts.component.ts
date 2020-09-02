import { Component, OnInit} from '@angular/core';
import {trigger, style, animate, transition } from '@angular/animations';
// import { HttpClient } from "@angular/common/http";
import { ContactsService } from "../services/contacts.service";
import { Router } from '@angular/router';

import { Contact } from '../models/contact.model';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],

  animations: [
    trigger(
      'slideAnimation', [
        transition(':enter', [
          style({transform: 'translateY(15px)', opacity: 0}),
          animate('350ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
        ])
      ]
    )
  ],
})
export class ContactsComponent implements OnInit {
  /* 
  **  On déclare nos variables de component ici
  **  ELles sont accessibles dans la vue (le template html du component)
  */
  title = 'Application Contacts';
  ALL_CONTACTS:Array<Contact> = [];  // La liste de contacts
  contacts:Array<Contact> = [];  // La liste de contacts à afficher

  favs:Array<Contact> = [];      // La liste des favoris
  loading:boolean;        // Pour afficher ou non le loader SVG dans la vue
  isOpen:boolean = false;
  isFormVisible:boolean = false; // Est-ce que le form est visible
  orderCriteria:string;          // Le critère d'orderBy() - 'date' ou 'name.last'
  toggleGridList:string;         // 'grid' ou 'list'

  selectedContact:Contact; // L'objet Contact lors de l'ouverture du formulaire d'ajout/modification (showContactForm())
  selectedContactIndex=-1; // L'index de l'objet Contact


  /*
  **  On déclare les méthodes de la class dans l'ordre :
  **  - constructor() qui servira d'injecteur de dépendances
  **  - ngOnInit() méthode du cycle de vie du component qui s'éxécute au démarrage du component
  **  - nos méthodes : orderBy(), showDetails(), deleteContact(), showContactForm(), addOrRemoveToFavs(), showContactForm(), storeContact()
  */
  constructor(
    //private http:HttpClient, 
    private contactService:ContactsService, 
    private router:Router) { }

  ngOnInit() { 
    
    // On affiche le Loader (indicateur de chargement)
    this.loading = true;

    // On précise l'ordre d'affichage par date 
    // orderCriteria est utilisé plus bas par la méthode orderBy()
    this.orderCriteria ='date';

    // On précise au chargement l'affichage de type liste
    this.toggleGridList = "list";
    

    

    // On récupère les données et on charge la variable this.contacts
    /*
    this.http.get('https://randomuser.me/api/?results=10&nat=fr')
              .subscribe(
                data => {console.log(data); this.contacts = data['results']}
              );
    */
    //        ^^^                                                        ^^^
    // On déporte la requête précédente (ci-dessus) dans un service (services/contacts.service.ts)
    // On sépare ainsi :
    //  -> la "logique" (ici dans le component) 
    //  -> de l'accès aux données (dans un service que l'on peut appeler de n'importe quel autre component)
  
    /* DONNEES 1 : A l'initialisation, on charge Tous les contacts */
    // SI il y a des contact dans contactsSubject
    // console.log(this.contactService.contactsSubject);
    
    this.contactService.getContacts(20).subscribe(
      data => {
          console.log(data); 
          this.contacts = data; 
          this.ALL_CONTACTS = data;
          this.isOpen = !this.isOpen;
          if(data.length>0) this.loading=false;
          console.log(this.loading);
      }
    );

    /*
          Bonne organisation du code : 
           Ci-dessus on a délégué à notre service le code qui suit, via la méthode getContacts()
          (Rappel : le service centralise la donnée principales contactsSubject, et fournit à TOUS les component les méthodes d'accès, suppression, update)
    */
    // this.contactService.contactsSubject.subscribe( data => {
    //   if(data.length === 0) {
    //     this.contactService.getContacts(10).subscribe(
    //       data => {
    //           // console.log(data); 
    //           this.contacts = data['results']; 
    //           this.contactService.contactsSubject.next(this.contacts);
    
    //           this.loading=false;
    //           this.isOpen = !this.isOpen;
    //       }
    //     );

    //   }
    //   else{
    //     this.contacts = data;
    //     this.loading=false;
    //     this.isOpen = !this.isOpen;
    //   }
    // }) 


    /* DONNEES 2 : A l'initialisation, on charge le Array des favoris */
    this.contactService.getFavs().subscribe( data => {
      this.favs = data;
    });
    
   
  } // FIN ngOnInit()


  filterContacts(searchWord) {
    searchWord = searchWord.toLowerCase();

    this.contacts = this.ALL_CONTACTS;
    this.contacts = this.ALL_CONTACTS.filter(contact => {
      return contact.name.first.toLowerCase().includes(searchWord) ||
             contact.name.last.toLocaleLowerCase().includes(searchWord)
    });
  }


  /*
    Fonction: orderBy()
    Description: Permet d'afficherla liste des contacts ordonnée par date ou lastname
    @param: prend en paramètre une string 'date' ou 'lastname'
  */
  orderBy() {
    this.orderCriteria == 'date'? this.orderCriteria='lastname':this.orderCriteria='date';
  }




  /*
    Fonction: showDetailAction()

    Description: Permet d'afficher les détails d'un contact
    @param: prend en paramètre l'objet event et l'objet contact qui a été cliqué

    INFO : On utilise la méthode navigate du Router angular pour naviguer sur l'url /detail
    On push l'objet contact dans le contactService.detailSubject
  */
  showDetailsAction(event, id) {
    event.preventDefault();
    this.router.navigate(['/contact', id]);
  }
  
  
  
  
  /*
    Fonction: deleteContactAction()

    Description: Permet de supprimer un contact dans le tableau contacts
    @param: prend en paramètre l'objet Contact
  */
  deleteContactAction(event,contact:Contact) {
    event.stopPropagation();

    if(confirm('Voulez-vous vraiment supprimer ' + contact.name.first )) { 
        /*
          Bonne organisation du code : 
          on délègue l'accès des données à la méthode removeContact() de notre contactService 
          (où est notre donnée centrale contactsSubject)
        */
        this.contactService.removeContact(contact);  
    }
  }
  
  
  
  
  /*
    Fonction: showContactFormAction

    Description: Permet de supprimer un contact dans le tableau contacts
    @param: prend en paramètre l'objet Contact
  */
  showContactFormAction(event,contact?) {
    event.stopPropagation();
    
    if(contact) {
      this.selectedContact = contact;
      this.selectedContactIndex = this.contacts.indexOf(contact);
    }
    else {
      this.selectedContactIndex = -1;
    }
    this.isFormVisible==false ? this.isFormVisible=true : this.isFormVisible=false;
    console.log(this.selectedContactIndex);
  }





  /*
    Fonction: storeContact()

    Description: Permet d'ajouter un nouveau contact et de mettre à jour contactSubject avec en valeur le nouveau array Contact
    @param: prend en paramètre l'objet Contact à ajouter
  */
  storeContact(contact): void {
    console.log(contact); // Un object FormBuilder
    let newcontact = new Contact( 
                                  contact.title, 
                                  contact.first.toLowerCase(), 
                                  contact.last.toLowerCase(),
                                  contact.email,
                                  contact.cell,
                                  contact.street,
                                  contact.postcode,
                                  contact.city
                                );
    console.log(newcontact);
    /* 
      Le model "Contact" (src/app/models/contact.model.ts)
      nous permet de créer un objet Contact simplement avec la syntaxe de class new Contact()

      Cette façon de faire remplace la création d'un objet littéral suivant :
    */

    // let newcontact = {
    //   id: Date.now(),
    //   registered: {
    //     date:new Date().toJSON()
    //   },
    //   name: {
    //     first: contact.contact.first.toLowerCase(),
    //     last: contact.contact.last.toLowerCase()
    //   },
    //   email: contact.contact.email,
    //   cell: contact.contact.cell,
    //   location: {
    //     street: contact.contact.address.toLowerCase(),
    //     postcode: contact.contact.cp,
    //     city: contact.contact.city.toLowerCase()
    //   }, 
    //   picture: {
    //     thumbnail: "assets/fake-user.png", 
    //     large: "assets/fake-user.png"
    //   }, 
    //   
    // }

    // CREATE 
    if(!newcontact.id) {
      let contacts;
      // la fonction guidGenerator() dans le service permet de créer un fake ID 
      newcontact.id = this.contactService.guidGenerator(); 
      // On push le nouveau contact en utilisant ES6
      contacts = [newcontact, ...this.contacts];
      /*
        On envoie le nouveau array de contacts dans le contactsSubject
          Bonne organisation du code : 
          on délègue l'accès des données à la méthode setContacts() de notre contactService 
          (où est notre donnée centrale contactsSubject)
      */
      this.contactService.setContacts(contacts);
    }
    
    this.isFormVisible = false;
  }




 /*
    Fonction: addOrRemoveToFavAction

    Description: Permet d'ajouter un nouveau contact au tableau des favoris
    @param: prend en paramètre l'objet Contact à ajouter au tableau des favoris
  */
addOrRemoveToFavAction(event, contact) {
  event.stopPropagation();
  // Récupère l'objet contact de la liste "favs" / return null si il n'existe pas dans la liste "favs"
  let favContact= this.getContactByIdFromFavsArray(this.favs, contact.id);
  console.log(favContact);
  if (favContact) {
    // event.currentTarget.querySelector('i').classList.add('fas');
    let index = this.favs.indexOf(favContact);
    this.calculateClass(contact);
    this.favs.splice(index, 1);
    this.contactService.setFavs(this.favs);
  }
  else {
    // event.currentTarget.querySelector('i').classList.remove('fas');
    this.calculateClass(contact);
    this.contactService.setFavs([contact, ...this.favs]);
  }
  
  // SI ON DEVAIT ACCEDER AU DOM POUR MODIFIER UNE CLASS (à ne pas faire avec Angular)
  // event.currentTarget.querySelector('i').classList.toggle('fas');
  /* NOTE : il faut éviter absolument d'utiliser la sélection et modification du DOM
            et laisser angular gérer cette partie

            Si vous souhaitez modifier des class ou du style, utiliser les directives ngClass et ngStyle
            https://angular.io/api/common/NgClass
            https://angular.io/api/common/NgStyle
  */
}




/* 
 * calculateClass()
 * fonction chargée de modifier la class des icone "favoris" dans la vue src/app/contacts.compoenent.html
 * <i class="fa-star primary" [style.color]="calculateClass(contact)?'orange':'black'" [ngClass]="calculateClass(contact)?'fas':'far'"></i>
 * 
*/
calculateClass(contact) {
  let contactId = contact.id;
  if (this.favs.filter(e => e.id === contactId).length > 0) {
    return true;
  }
  else {
    return false;
  }
}


/* 
 * selectGridOrList()
 * fonction chargée d'assigner la valeur 'grid' ou 'list' alternativement à la variable toggleGridList
 * Dans la vue cela nous permet d'afficher la liste des contacts sous forme de liste ou de grille d'images
*/
selectGridOrList():void {
  this.toggleGridList=='grid'?this.toggleGridList='list':this.toggleGridList='grid';
}




/*
**  function getContactByIdFromFavsArray(arr, id)
**  Récupère l'objet contact de la liste "favs"
**  return null si il n'existe pas dans la liste "favs"
**  @param arr: le Array favs
**  @param id : l'id du contact recherché
**
**  @return l'objet contact trouvé, sinon null
*/
getContactByIdFromFavsArray(arr, id) {
  var result  = arr.filter( contact => contact.id == id );
  return result? result[0] : null; // or undefined
} 



}
// FIN CLASS
