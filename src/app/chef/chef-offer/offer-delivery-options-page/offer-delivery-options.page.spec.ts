import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { OfferDeliveryOptionsPage } from './offer-delivery-options.page';

describe('OfferDeliveryOptionsPage', () => {
  let component: OfferDeliveryOptionsPage;
  let fixture: ComponentFixture<OfferDeliveryOptionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDeliveryOptionsPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferDeliveryOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
