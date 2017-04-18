/**
 * Created by ruic on 11/02/2017.
 */


import {Routes, RouterModule} from '@angular/router';
import {
    AboutComponent,
    ContactComponent,
    BlogComponent,
    EditPortfolioComponent,
    PortfolioComponent,
    HomeComponent,
    PageNotFoundComponent,
    NoPermissionsComponent
} from "./components/pages/index.d";

export const appRoutes: Routes = [
    {path: "", component: HomeComponent},
    {path: "portfolio", component: PortfolioComponent},
    {path: "edit-portfolio", component: EditPortfolioComponent},
    {path: "contact", component: ContactComponent},
    {path: "blog", component: BlogComponent},
    {path: "blog/:blogTitle", component: BlogComponent},
    {path: "forbidden", component: NoPermissionsComponent},
    {path: "about", component: AboutComponent},
    {path: "404", component: PageNotFoundComponent},
    {path: '**', component: PageNotFoundComponent},
];
export const routing = RouterModule.forRoot(appRoutes);
