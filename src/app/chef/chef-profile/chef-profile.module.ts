import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CodeInputModule } from 'angular-code-input';
import { ChefProfilePage } from './chef-profile.page';
import { ChefProfilePageRoutingModule } from './chef-profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CodeInputModule,
    ChefProfilePageRoutingModule,
  ],
  declarations: [ 
    ChefProfilePage,
  ],
  entryComponents: [  ]
})
export class ChefProfileModule {}