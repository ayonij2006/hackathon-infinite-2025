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
        label: 'GeneSSIS',
        icon: 'pi pi-fw pi-bolt',
        command: () => this.hardReload(),      
      },
      {
        label: 'About Us',
        icon: 'pi pi-fw pi-info-circle',
        items: [
          {
            label: 'Team',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/about/team'],
            items: [
              {
              label: 'Ayonij Karki',
              icon: 'pi pi-fw pi-user',
              },
              {
                label: 'Ayush Guidel',
                icon: 'pi pi-user',
              },
              {
                label: 'Saroj Ramtel',
                icon: 'pi pi-user',
              },
              {
                label: 'Saroj Sharma',
                icon: 'pi pi-user',
              },
              {
                label: 'Shahad Shrestha',
                icon: 'pi pi-user',
              }
            ]
          },
        ]
      },
    ];
  }

  hardReload() {
    window.location.reload();
  }

}
