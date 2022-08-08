import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefProfileAboutMePage } from './chef-profile-aboutme.page';
import { ChefProfileAboutMePageRoutingModule } from './chef-profile-aboutme-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ChefProfileAboutMePageRoutingModule,
  ],
  declarations: [ 
    ChefProfileAboutMePage
  ]
})
export class ChefProfileAboutMeModule {}