import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefChatPage } from './chef-chat.page';


const routes: Routes = [
  {
    path: '',
    component: ChefChatPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChefChatRoutingModule {}