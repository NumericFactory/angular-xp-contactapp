import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact.model';

// import { Observable } from "rxjs/Observable";

@Injectable()


export class ContactsService {

/*
 * Pour communiquer entre 2 components, 
 * une des techniques existantes 
 * est d'utiliser le BehaviorSubject de RxJS
 * 
 * Le BehaviorSubject est capable de:
 * 1/ pusher une donnée depuis un component grâce à la méthode .next()
 * 2/ récupérer cette donnée depuis un autre component en s'abonnant à la méthode .subscribe()
*/
  // On créé donc un BehaviorSubject dans lequel on peut pousser une donnée de type array de contacts depuis un component avec la méthode .next()
  // On le récupèrera depuis un autre component en s'abonnant avec la méthode .subscribe() 
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private favsSubject = new BehaviorSubject<Contact[]>([]);
  private BASE_URL = 'https://randomuser.me/api/?nat=fr&inc=gender,name,picture,cell,email,location,registered';
/*
   FIN DE LA TECHNIQUE POUR COMMUNIQUER ENTRE COMPONENTS
*/

  // Notre service a besoin d'utiliser HTTPCLIENT pour faire une requête de type get sur l'API randomuser.me (https://randomuser.me/)
  // Pour ce faire, on l'injecte dans le constructeur via le principe d'injection de dépendance d'Angular
  constructor(private http:HttpClient) { }


  /*
    getContacts()
    param: le nombre de contacts que l'on veut (type : number)
    @return : Observable qui contient notre Array de contacts - le component ContactsComponent (la liste)  peut s'y abonner
    url : //this.http.get('https://randomuser.me/api/?results=10&nat=fr&seed=d9a86e623119c8b7').subscribe();

    Le principe de la fonction : 
    SI le contactsSubject ne contient pas de contacts, 
    ALORS on fait la request et on assigne la réponse en valeur de notre subject ( via la méthode .next() )
    PUIS ENFIN on return le contactsSubject
  */
  getContacts(numberOfContacts:number) {
    this.contactsSubject.subscribe( data => {
      // SI le contactsSubject ne contient pas de Contact, 
      // alors on call les données sur l'API randomuser.me
      if(data.length === 0) {
        
        this.http.get(this.BASE_URL+'&results='+numberOfContacts)
                 .subscribe(
                    data => {
                        // LA réponse du server randomuser.me
                        let contacts = data['results']; // Array of Contacts
                        // On attribue un fake id à chaque contact
                        for(let contact of contacts) { contact.id = this.guidGenerator()}
                        // On envoie dans le contactsSubject le tableau de contacts 
                        this.contactsSubject.next(contacts);
                    }
                 )
      }  
    })

    console.log(this.contactsSubject);
    // La fonction return le contactsSubject, 
    // et notre ContactComponent POURRA s'y abonner pour récupérer la liste des contacts quand elle arrivera
    return this.contactsSubject;
  }



  /*
    setContacts(contacts)
    param : un objet de type Array of Contact
    @return : void (ne retourne rien)
    rôle : function chargée de mettre à jour le contactsSubject avec en valeur un nouveau tableau de Contact
  */
  setContacts(contacts:Contact[]):void {
    this.contactsSubject.next(contacts);
  }
  

  /*
    addContact(contact)
    param : un objet de type Contact
    @return : void (ne retourne rien)
    rôle : function chargée d'ajouter un contact au tableau des contacts et pousser ce nouveau tableau dans le contactsSubject
           Ainsi le component contacts qui est abonnné à ce subject sera mis à jour et la liste sera rafraîchie
  */
  addContact(contact:Contact) {
    let contacts = this.contactsSubject.getValue();
    contacts = [contact, ...contacts];
    this.contactsSubject.next(contacts);
  }


  /*
    removeContact(contact)
    param : un objet de type Contact
    @return : void (ne retourne rien)
    rôle : function chargée de supprimer un contact au tableau des contacts et pousser ce nouveau tableau dans le contactsSubject
           Ainsi le component contacts qui est abonnné à ce subject sera mis à jour et la liste sera rafraîchie
  */
  removeContact(contact:Contact):void {
    let index = this.contactsSubject.getValue().indexOf(contact);
    this.contactsSubject.getValue().splice(index, 1);
  }


  /*
    setFavs(contacts)
    @return : favsSubject contenant en valeur un  array of Contact
  */
  setFavs(contacts:Contact[]):void {
    this.favsSubject.next(contacts);
  }




  /*
    getFavs(contacts)
    param : un objet de type Array of Contact
    @return : void (ne retourne rien)
    rôle : function chargée de mettre à jour le favsSubject avec en valeur un nouveau tableau de Contact
  */
  getFavs(){
    return this.favsSubject;
  }




  /*
    guidGenerator() - fonction utilitaire
    rôle : functon chargée de retourner un ID unique (on l'attribue à chacun de nos contacts pour gérer l'accès, suppression, update)
    @return : une string qui représente un identifiant unique
  */
  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }


}
