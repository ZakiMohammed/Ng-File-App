import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';
import { UploadVergeComponent } from './components/upload-verge/upload-verge.component';


const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'upload-verge', component: UploadVergeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
