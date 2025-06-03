import { Routes } from '@angular/router';
import { Container } from './layout/container/container';

export const routes: Routes = [
    {
        path: 'genessis',
        component: Container,
    },
    {
        path: '',
        redirectTo: 'genessis',
        pathMatch: 'full'
    }
];
