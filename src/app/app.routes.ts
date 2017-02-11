/**
 * Created by ruic on 11/02/2017.
 */


import { Routes, RouterModule } from '@angular/router';
import { NoPermissionsComponent } from "./components/no-permissions/no-permissions.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";


export const appRoutes: Routes = [
    {path: "forbidden", component: NoPermissionsComponent},
    {path: "404", component: PageNotFoundComponent},
    {path: '**', component: PageNotFoundComponent},
];
export const routing = RouterModule.forRoot(appRoutes);
