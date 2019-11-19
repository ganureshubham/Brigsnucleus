import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { AssetmateService } from '../../../../service/assetmate.service';
import { MatSnackBar } from '@angular/material';
import { checklistQuestion, questionOption } from '../../../../../../model/checklistQuestion';
import { ActivatedRoute } from '@angular/router';

interface QuestionTypeOption {
  questionTypeId: number,
  title: string
}

interface QuestionOptions {
  optionControl: string,
  checkboxControl: string
}

@Component({
  selector: 'app-add-checklist-question',
  templateUrl: './add-checklist-question.component.html',
  styleUrls: ['./add-checklist-question.component.css']
})
export class AddChecklistQuestionComponent implements OnInit {

  formGroup: FormGroup;
  arrFormGroupsForFormArray: FormGroup[] = [];
  arrChecklistQuestionType: QuestionTypeOption[] = [];

  quetionTypeFormGroup: FormGroup;
  questionDescription: FormGroup;
  questionOptions: FormGroup;

  arrOption: QuestionOptions[] = [];
  checkListId: number;
  questionId: number;

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private location: Location,
    private _formBuilder: FormBuilder,
    private assetmateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.checkListId = Number(this.activatedRoute.snapshot.parent.params['checkListId']);
    this.questionId = this.activatedRoute.snapshot.params['questionId'];

    this.getChecklistQuestionTypes();

    this.quetionTypeFormGroup = this._formBuilder.group({
      selectQuestionTypeFormCtrl: ['', Validators.required],
    });

    this.questionDescription = this._formBuilder.group({
      questionDescriptionFormCtrl: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      questionCompulsoryFormCtrl: [true]
    });

    this.questionOptions = this._formBuilder.group({
      'option0': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'checkbox0': [''],
    });

    this.arrFormGroupsForFormArray.push(
      this.quetionTypeFormGroup
    );

    this.arrFormGroupsForFormArray.push(
      this.questionDescription
    );

    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this.arrFormGroupsForFormArray[0],
        this.arrFormGroupsForFormArray[1],
      ])
    });

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  backToListChecklistQuestionList() {
    this.location.back();
  }

  getChecklistQuestionTypes() {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getCheckListQuestionTypes().subscribe((resp: any) => {

      this.spinnerService.setSpinnerVisibility(false);

      if (resp.QuestionType) {
        this.arrChecklistQuestionType = resp.QuestionType;
      } else {
        this.showSnackBar(resp.message);
      }

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

  onQuestionTypeSelectionChange(questionTypeValue) {

    //Question type value 
    // 1 --- Input
    // 2 --- Date
    // 3 --- Single Option
    // 4 --- Multiple Option
    // 5 --- Take Photo

    //If question type value is not 1, 2, 5 then only enable "Question Option" step
    if (questionTypeValue != 1 && questionTypeValue != 2 && questionTypeValue != 5) {

      //Add "Question Option" step if not already present
      let formArray: any = this.formGroup.controls.formArray;
      if (formArray.controls.length <= 2) {
        let formGroupFormArray: any = (this.formGroup.get('formArray'));
        formGroupFormArray.push(this.questionOptions);
      }

    } else {

      //Remove if "Question Option" step is already there
      let formArray: any = this.formGroup.controls.formArray;
      if (formArray.controls.length > 2) {
        let formGroupFormArray: any = (this.formGroup.get('formArray'));
        formGroupFormArray.controls.pop();

        this.arrOption = [];
        this.questionOptions = this._formBuilder.group({
          option0: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          checkbox0: [''],
        });

      }

    }

  }

  onNewOptionAddClicked() {

    let randomNo = this.getRandomInt();

    this.questionOptions.addControl('option' + randomNo, new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])));
    this.questionOptions.addControl('checkbox' + randomNo, new FormControl(''));

    this.arrOption.push({
      optionControl: 'option' + randomNo,
      checkboxControl: 'checkbox' + randomNo
    });

    // console.log('this.arrOption add --- >');
    // console.log(this.arrOption);

    // this.questionOptions.addControl('option' + (this.arrOption.length + 1), new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])));
    // this.questionOptions.addControl('checkbox' + (this.arrOption.length + 1), new FormControl(''));

    // this.arrOption.push({
    //   optionControl: 'option' + (this.arrOption.length + 1),
    //   checkboxControl: 'checkbox' + (this.arrOption.length + 1)
    // });

    // console.log('this.arrOption add --- >');
    // console.log(this.arrOption);

  }

  onQuestionOptionDelete(optionIndex) {

    let formControlLable = this.arrOption[optionIndex];

    this.arrOption.splice(optionIndex, 1);
    this.questionOptions.removeControl('option' + formControlLable);
    this.questionOptions.removeControl('checkbox' + formControlLable);

    // console.log('this.arrOption --- >');
    // console.log(this.arrOption);

    // this.arrOption.splice(optionIndex, 1);
    // this.questionOptions.removeControl('option' + this.arrOption.length);
    // this.questionOptions.removeControl('checkbox' + this.arrOption.length);

    // console.log('this.arrOption --- >');
    // console.log(this.arrOption);

  }

  isQuestionOptionSectionAllowed() {
    let formArray: any = this.formGroup.controls.formArray;
    return formArray.controls.length > 2;
  }

  getRandomInt() {
    // min = 1 and max = 100 included 
    return Math.floor(Math.random() * (100 - 1 + 1) + 1);
  }

  addNewQuestion() {

    // console.log('submitForm : --' + this.formGroup.valid);
    // console.log(this.formGroup);

    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    // console.log('formGroupFormArray');
    // console.log(formGroupFormArray.controls[0].get('selectQuestionTypeFormCtrl').value);

    let checklistQuestion: checklistQuestion = {
      title: formGroupFormArray.controls[1].get('questionDescriptionFormCtrl').value,
      questionTypeIdFK: formGroupFormArray.controls[0].get('selectQuestionTypeFormCtrl').value,
      checkListIdFK: this.checkListId,
      isCompulsory: formGroupFormArray.controls[1].get('questionCompulsoryFormCtrl').value ? 1 : 0,
      options: []
    }

    if (this.isQuestionOptionSectionAllowed()) {

      // console.log('isQuestionOptionSectionAllowed');
      // console.log(formGroupFormArray.controls[2]);

      //Insert default option0 and checkbox0
      checklistQuestion.options.push(
        {
          optionTitle: formGroupFormArray.controls[2].get('option0').value,
          isDanger: formGroupFormArray.controls[2].get('checkbox0').value ? 1 : 0
        }
      );

      //Insert remaining options with checkbox status
      for (let option of this.arrOption) {
        checklistQuestion.options.push(
          {
            optionTitle: formGroupFormArray.controls[2].get(option.optionControl).value,
            isDanger: formGroupFormArray.controls[2].get(option.checkboxControl).value ? 1 : 0
          }
        );
      }

    }

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.addChecklistQuestion(checklistQuestion).subscribe(resp => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(resp.message);
      this.assetmateService.setBadgeUpdateAction('questionList', true);
      this.location.back();
    }, error => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar("Something went wrong..!!");
    });

  }

  getUserFilledStep1DataForReview() {
    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    for (let questionType of this.arrChecklistQuestionType) {
      if (questionType.questionTypeId == formGroupFormArray.controls[0].get('selectQuestionTypeFormCtrl').value) {
        return questionType.title;
      }
    }
  }

  getUserFilledStep2DataForReview() {
    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    return formGroupFormArray.controls[1].get('questionDescriptionFormCtrl').value;
  }

  getOptionLable(optionControl) {
    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    return formGroupFormArray.controls[2].get(optionControl).value;
  }

  getQuestionType() {

    //Question type value 
    // 1 --- Input
    // 2 --- Date
    // 3 --- Single Option
    // 4 --- Multiple Option
    // 5 --- Take Photo

    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    let selectionOptionType = formGroupFormArray.controls[0].get('selectQuestionTypeFormCtrl').value;

    return selectionOptionType;

  }

  getBackBtnLable() {
    return this.questionId == 0 ? 'Question List' : 'Question Details';
  }

}
