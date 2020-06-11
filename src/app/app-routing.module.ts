import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExecutiveSummaryComponent} from './components/executive-summary/executive-summary.component';
import { PostinitComponent } from './components/postinit/postinit.component';
import { PreprocessComponent } from './components/preprocess/preprocess.component';


const routes: Routes = [
  {path:'',component:ExecutiveSummaryComponent},
  {path:'preprocess',component:PreprocessComponent},
  {path:'postinit',component:PostinitComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
