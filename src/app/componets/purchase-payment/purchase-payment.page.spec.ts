import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurchasePaymentPage } from './purchase-payment.page';

describe('PurchasePaymentPage', () => {
  let component: PurchasePaymentPage;
  let fixture: ComponentFixture<PurchasePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchasePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
