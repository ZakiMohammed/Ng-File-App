import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';


const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'upload', component: UploadComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
