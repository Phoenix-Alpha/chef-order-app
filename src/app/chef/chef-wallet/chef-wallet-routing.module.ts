import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPage } from 'src/app/shared/empty-page/empty.page';
import { ChefWalletReturnGuard } from './chef-wallet-return.guard';
import { ChefWalletInfoPage } from './chef-wallet-info/chef-wallet-info.page';
import { ChefWalletPage } from './chef-wallet.page';
import { ChefWalletPageGuard } from './chef-wallet.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ ChefWalletPageGuard ],
    component: ChefWalletPage,
  },
  // {
  //   path: 'info',
  //   component: ChefWalletInfoPage,
  // },
  {
    path: 'return',
    canActivate: [ ChefWalletReturnGuard ],
    component: EmptyPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChefWalletPageRoutingModule {}