import { Routes } from '@angular/router';
import { AuthLayout } from '../app/layouts/auth-layout/auth-layout';


export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [],
    },
];
