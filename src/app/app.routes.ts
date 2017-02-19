/**
 * Created by ruic on 11/02/2017.
 */


import {Routes, RouterModule} from '@angular/router';
import {NoPermissionsComponent} from "./components/no-permissions/no-permissions.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {PortfolioComponent} from "./components/portfolio/portfolio.component";
import {EditPortfolioComponent} from "./components/edit-portfolio/edit-portfolio.component";
import {BlogComponent} from "./components/blog/blog.component";


export const appRoutes: Routes = [
    {path: "", component: HomeComponent},
    {path: "portfolio", component: PortfolioComponent},
    {path: "edit-portfolio", component: EditPortfolioComponent},
    {path: "blog", component: BlogComponent},
    {path: "blog/:blog", component: BlogComponent},
    {path: "forbidden", component: NoPermissionsComponent},
    {path: "404", component: PageNotFoundComponent},
    {path: '**', component: PageNotFoundComponent},
];
export const routing = RouterModule.forRoot(appRoutes);
