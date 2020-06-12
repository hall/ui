import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessCodeService } from 'src/app/data/accesscode.service';
import { AccessCode } from 'src/app/data/accesscode';
import { EditAccessCodeComponent } from './edit-accesscode/edit-accesscode.component';

@Component({
  selector: 'app-accesscodes',
  templateUrl: './accesscodes.component.html',
  styleUrls: ['./accesscodes.component.scss']
})
export class AccessCodesComponent implements OnInit {
  public accesscodes: AccessCode[] = [];
  public updateAc: AccessCode;

  constructor(
    public accessCodeService: AccessCodeService
  ) { }

  @ViewChild("editAccessCodeWizard", {static: true}) editAcWizard: EditAccessCodeComponent;

  ngOnInit() {
    this.refresh();
  }


  public refresh() {
    this.accessCodeService.list()
    .subscribe(
      (a: AccessCode[]) => this.accesscodes = a
    )
  }

  public openNew() {
    this.updateAc = undefined;
    this.editAcWizard.open();
  }

  public openUpdate(index: number) {
    this.updateAc = this.accesscodes[index];
    this.editAcWizard.open();
  }

  public delete(ac: string) {
    this.accessCodeService.delete(ac).subscribe(
      () => this.refresh());
  }
}
