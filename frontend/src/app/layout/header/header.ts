import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { FileImport } from "../../components/file-import/file-import";

@Component({
  selector: 'app-header',
  imports: [CommonModule,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    InputTextModule,
    MenubarModule, FileImport],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/']
      },
      {
        label: 'About Us',
        icon: 'pi pi-fw pi-info-circle',
        items: [
          {
            label: 'Team',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/about/team']
          },
          {
            label: 'Contact',
            icon: 'pi pi-fw pi-phone',
            routerLink: ['/about/contact']
          }
        ]
      },
    ];
  }

}
