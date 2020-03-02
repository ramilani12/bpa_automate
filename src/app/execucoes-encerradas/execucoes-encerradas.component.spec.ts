import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecucoesEncerradasComponent } from './execucoes-encerradas.component';

describe('ExecucoesEncerradasComponent', () => {
  let component: ExecucoesEncerradasComponent;
  let fixture: ComponentFixture<ExecucoesEncerradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecucoesEncerradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecucoesEncerradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
