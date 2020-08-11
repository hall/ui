import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessCodeService } from './accesscode.service';
import { AccessCode } from './accesscode';
import { EditAccessCodeComponent } from './edit-accesscode/edit-accesscode.component';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-accesscodes',
  templateUrl: './accesscodes.component.html',
  styleUrls: ['./accesscodes.component.scss']
})
export class AccessCodesComponent implements OnInit {
  public accesscodes: AccessCode[] = [];
  public updateAc: AccessCode;

  public users;

  constructor(
    public accessCodeService: AccessCodeService,
    public userService: UserService
  ) { }

  @ViewChild("editAccessCodeWizard", {static: true}) editAcWizard: EditAccessCodeComponent;

  ngOnInit() {
    this.refresh();
  }

  public refresh() {
    this.accessCodeService.list()
    .subscribe(
      (a: AccessCode[]) => {
        this.accesscodes = a
        this.userService.getUsers()
      }
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
