import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimpleProductPage } from './simple-product.page';

describe('SimpleProductPage', () => {
  let component: SimpleProductPage;
  let fixture: ComponentFixture<SimpleProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
