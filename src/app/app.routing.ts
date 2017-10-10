import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuleWithProviders } from '@angular/core';
import { TestComponent } from './components/test/test.component';

import { LoginComponent } from './components/user/login/login.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { RegisterComponent } from './components/user/register/register.component';

import { WebsiteNewComponent } from './components/website/website-new/website-new.component';
import { WebsiteEditComponent } from './components/website/website-edit/website-edit.component';
import { WebsiteListComponent } from './components/website/website-list/website-list.component';

import { PageListComponent } from './components/page/page-list/page-list.component';
import { PageEditComponent } from './components/page/page-edit/page-edit.component';
import { PageNewComponent } from './components/page/page-new/page-new.component';

import { WidgetChooserComponent } from './components/widget/widget-chooser/widget-chooser.component';
import { WidgetEditComponent } from './components/widget/widget-edit/widget-edit.component';
import { WidgetListComponent } from './components/widget/widget-list/widget-list.component';

const APP_ROUTES: Routes = [
  { path : '', component : HomeComponent},
  { path : 'test', component: TestComponent},
  { path : 'login' , component: LoginComponent},
  { path : 'register' , component: RegisterComponent },
  { path : 'user/:userId' , component: ProfileComponent},
  { path : 'user/:userId/website' , component: WebsiteListComponent},
  { path : 'user/:userId/website/new' , component: WebsiteNewComponent},
  { path : 'user/:userId/website/:websiteID' , component: WebsiteEditComponent},
  { path : 'user/:userId/website/:websiteID/page' , component: PageListComponent},
  { path : 'user/:userId/website/:websiteID/page/:pageID' , component: PageEditComponent},
  { path : 'user/:userId/website/:websiteID/page/new' , component: PageNewComponent},
  { path : 'user/:userId/website/:websiteID/page/:pageID/widget/new' , component: WidgetChooserComponent},
  { path : 'user/:userId/website/:websiteID/page/:pageID/widget/:widgetID' , component: WidgetEditComponent},
  { path : 'user/:userId/website/:websiteID/page/:pageID/widget' , component: WidgetListComponent},
];

// Export the routes as module providers
export const Routing = RouterModule.forRoot(APP_ROUTES);
