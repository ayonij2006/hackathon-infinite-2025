import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  imports: [ ProgressSpinnerModule 
    ],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loader implements OnInit{

  constructor(private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {
  }

  loading: boolean = false;

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((val: boolean) => {
      this.loading = val;
      this.cdr.markForCheck();
    })
  }
}
