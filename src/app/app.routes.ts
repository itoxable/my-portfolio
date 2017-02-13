/**
 * Created by ruic on 11/02/2017.
 */


import {Routes, RouterModule} from '@angular/router';
import {NoPermissionsComponent} from "./components/no-permissions/no-permissions.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {PortfolioComponent} from "./components/portfolio/portfolio.component";


export const appRoutes: Routes = [
    {path: "", component: HomeComponent},
    {path: "portfolio", component: PortfolioComponent},
    {path: "forbidden", component: NoPermissionsComponent},
    {path: "404", component: PageNotFoundComponent},
    {path: '**', component: PageNotFoundComponent},
];
export const routing = RouterModule.forRoot(appRoutes);
