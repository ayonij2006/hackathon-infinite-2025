import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  imports: [ ProgressSpinnerModule 
    ],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements OnInit{

  constructor(private loaderService: LoaderService) {
  }

  loading: boolean = false;

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((val: boolean) => {
      this.loading = val;
    })
  }
}
