import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgxContentLoadingModule } from 'ngx-content-loading';

import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DetailsComponent } from './details/details.component';

import { ContactsService } from './services/contacts.service';
import { FirstletterPipe } from './pipes/firstletter.pipe';
import { AboutComponent } from './about/about.component';
import { FilterContactsPipe } from './pipes/filter-contacts.pipe';
import { DocumentationLinksComponent } from './documentation-links/documentation-links.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { OrderPipe } from './pipes/order.pipe';



@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    FirstletterPipe,
    DetailsComponent,
    AboutComponent,
    FilterContactsPipe,
    DocumentationLinksComponent,
    SidebarComponent,
    AddContactComponent,
    OrderPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxContentLoadingModule,
    AppRoutingModule
   
  ],
  providers: [ContactsService],
  bootstrap: [AppComponent, SidebarComponent]
  // bootstrap: [AppComponent, ContactsComponent, DetailsComponent]
})
export class AppModule { }
