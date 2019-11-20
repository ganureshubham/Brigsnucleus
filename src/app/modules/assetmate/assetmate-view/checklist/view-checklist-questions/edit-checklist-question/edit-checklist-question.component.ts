import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { AssetmateService } from '../../../../service/assetmate.service';
import { MatSnackBar } from '@angular/material';
import { checklistQuestion, questionOption } from '../../../../../../model/checklistQuestion';
import { ActivatedRoute } from '@angular/router';
import { questionDetails } from '../../../../../../model/questionDetails';

interface QuestionTypeOption {
  questionTypeId: number,
  title: string
}

interface QuestionOptions {
  isNewAddedOption: boolean,
  optionControl: string,
  checkboxControl: string
}

@Component({
  selector: 'app-edit-checklist-question',
  templateUrl: './edit-checklist-question.component.html',
  styleUrls: ['./edit-checklist-question.component.css']
})
export class EditChecklistQuestionComponent implements OnInit {

  formGroup: FormGroup;
  arrFormGroupsForFormArray: FormGroup[] = [];
  arrChecklistQuestionType: QuestionTypeOption[] = [];

  quetionTypeFormGroup: FormGroup;
  questionDescription: FormGroup;
  questionOptions: FormGroup;

  arrOption: QuestionOptions[] = [];
  checkListId: number;
  questionId: number;

  questionDetails: questionDetails;

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
    this.questionId = Number(this.activatedRoute.snapshot.params['questionId']);
    this.getChecklistQuestionTypes();
    this.setAllFormControls();

  }

  setAllFormControls() {

    this.quetionTypeFormGroup = this._formBuilder.group({
      selectQuestionTypeFormCtrl: [{ value: '', disabled: true }, Validators.required],
    });

    this.questionDescription = this._formBuilder.group({
      questionDescriptionFormCtrl: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      questionCompulsoryFormCtrl: [true]
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

    this.getQuestionDetails();

  }

  getQuestionDetails() {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getQuestionDetails(this.questionId).subscribe((resp: questionDetails) => {
      this.spinnerService.setSpinnerVisibility(false);

      if (resp.Question) {

        this.questionDetails = resp;

        let formArray: any = this.formGroup.controls.formArray;

        formArray.controls[0].controls['selectQuestionTypeFormCtrl'].setValue(resp.Question.questionTypeIdFK);
        formArray.controls[1].controls['questionDescriptionFormCtrl'].setValue(resp.Question.questionDescription);
        formArray.controls[1].controls['questionCompulsoryFormCtrl'].setValue(resp.Question.isCompulsory == 1 ? true : false);

        let countOfOptionsInQuestion = resp.Question.questionOptions.length;

        if (countOfOptionsInQuestion > 0) {
          for (let i = 0; i < countOfOptionsInQuestion; i++) {
            if (i == 0) {
              this.questionOptions = this._formBuilder.group({
                'option0': [resp.Question.questionOptions[i].optionTitle, Validators.compose([Validators.required, Validators.minLength(2)])],
                'checkbox0': [resp.Question.questionOptions[i].isDanger == 1 ? true : false],
              });
              let formGroupFormArray: any = (this.formGroup.get('formArray'));
              formGroupFormArray.push(this.questionOptions);
            } else {

              let randomNo = this.getRandomInt();
              this.questionOptions.addControl('option' + randomNo, new FormControl(resp.Question.questionOptions[i].optionTitle, Validators.compose([Validators.required, Validators.minLength(2)])));
              this.questionOptions.addControl('checkbox' + randomNo, new FormControl(resp.Question.questionOptions[i].isDanger));
              this.arrOption.push({
                isNewAddedOption: false,
                optionControl: 'option' + randomNo,
                checkboxControl: 'checkbox' + randomNo
              });

            }
          }
        }

      } else {
        this.showSnackBar(resp.message);
      }

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
      }
    );
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
      isNewAddedOption: true,
      optionControl: 'option' + randomNo,
      checkboxControl: 'checkbox' + randomNo
    });

  }

  onQuestionOptionDelete(optionIndex) {

    let formControlLable = this.arrOption[optionIndex];

    let isNewlyAddedLocalOption = this.arrOption[optionIndex].isNewAddedOption;

    this.arrOption.splice(optionIndex, 1);
    this.questionOptions.removeControl('option' + formControlLable);
    this.questionOptions.removeControl('checkbox' + formControlLable);

    if (!isNewlyAddedLocalOption) {
      this.spinnerService.setSpinnerVisibility(true);
      this.assetmateService.deleteChecklistQuestionOption(
        this.questionDetails.Question.questionOptions[optionIndex].questionOptionId
      ).subscribe((resp: any) => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(resp.message);
      }, error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
      })
    }

  }

  isQuestionOptionSectionAllowed() {
    let formArray: any = this.formGroup.controls.formArray;
    return formArray.controls.length > 2;
  }

  getRandomInt() {
    // min = 1 and max = 100 included 
    return Math.floor(Math.random() * (100 - 1 + 1) + 1);
  }

  updateQuestion() {

    // console.log('submitForm : --' + this.formGroup.valid);
    // console.log(this.formGroup);

    let formGroupFormArray: any = (this.formGroup.get('formArray'));
    // console.log('formGroupFormArray');
    // console.log(formGroupFormArray.controls[0].get('selectQuestionTypeFormCtrl').value);

    let checklistQuestion: any = {
      questionId: this.questionId,
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
          questionOptionId: this.questionDetails.Question.questionOptions[0].questionOptionId,
          optionTitle: formGroupFormArray.controls[2].get('option0').value,
          isDanger: formGroupFormArray.controls[2].get('checkbox0').value ? 1 : 0
        }
      );

      //Insert remaining options with checkbox status
      // for (let option of this.arrOption) {
      for (let i = 0; i < this.arrOption.length; i++) {
        checklistQuestion.options.push(
          {
            questionOptionId: this.arrOption[i].isNewAddedOption ? 0 : this.questionDetails.Question.questionOptions[i + 1].questionOptionId,
            optionTitle: formGroupFormArray.controls[2].get(this.arrOption[i].optionControl).value,
            isDanger: formGroupFormArray.controls[2].get(this.arrOption[i].checkboxControl).value ? 1 : 0
          }
        );
      }

    }

    this.spinnerService.setSpinnerVisibility(true);

    // console.log('checklistQuestion');
    // console.log(checklistQuestion);

    this.assetmateService.updateChecklistQuestion(checklistQuestion).subscribe(resp => {
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

}
