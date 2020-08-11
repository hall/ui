import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CourseService } from '../course.service';
import { Course } from '../course';
import { ServerResponse } from '../../utils/server-response';
import { ClrAlertType } from '../../utils/clr-alert-type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  @Output()
  public added: EventEmitter<boolean> = new EventEmitter(null);

  public course: Course = new Course();

  public form: FormGroup = new FormGroup({});

  public alertText: string = null;
  public isAlert: boolean = false;
  public alertType: string = ClrAlertType.Info;

  public newCourseOpen: boolean = false;

  constructor(
    public courseService: CourseService
  ) { }

  ngOnInit(): void {
  }

  setupForm(fg: FormGroup) {
    this.form = fg;
  }

  public open() {
    this.course = new Course();
    this.alertText = null;
    this.isAlert = false;
    this.newCourseOpen = true;
  }

  save() {
    this.course.name = this.form.get('course_name').value;
    this.course.description = this.form.get('course_description').value;
    this.course.keepalive_duration = this.form.get('keepalive_amount').value +
      this.form.get('keepalive_unit').value;
    this.course.pause_duration = +this.form.get('pause_duration').value;


    this.courseService.create(this.course)
      .subscribe(
        (s: ServerResponse) => {
          this.alertText = "Course created";
          this.isAlert = true;
          this.alertType = ClrAlertType.Success;
          this.added.emit(true);
          setTimeout(() => this.newCourseOpen = false, 1000);
        },
        (e: HttpErrorResponse) => {
          this.alertText = "Error creating object: " + e.error.message;
          this.isAlert = true;
        }
      )
  }
}
