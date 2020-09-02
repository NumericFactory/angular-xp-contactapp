import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  favs:Array<Object>;
  constructor(private contactService:ContactsService, private router: Router) { }

  ngOnInit() {
    this.contactService.getFavs().subscribe(
      data => this.favs = data
    );
  }

  showDetails(event, id) {
    event.preventDefault();
    this.router.navigate(['/contact', id]);
  }

}
