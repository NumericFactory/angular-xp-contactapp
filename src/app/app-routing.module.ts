import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DetailsComponent } from './details/details.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { DocumentationLinksComponent } from './documentation-links/documentation-links.component';

import { AboutComponent } from './about/about.component';


 const routes: Routes  = [
   { path: '', component: ContactsComponent },
   { path: 'contact/:id', component: DetailsComponent },
   { path: 'ajouter', component: AddContactComponent },
   { path: 'a-propos', component: AboutComponent },
   { path: 'liens-utiles', component: DocumentationLinksComponent }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
