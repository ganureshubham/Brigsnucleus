export interface checklistQuestion {
    title: string,
    questionTypeIdFK: number,
    checkListIdFK: number,
    isCompulsory: number,
    options: questionOption[]
}

export interface questionOption {
    optionTitle: string,
    isDanger: Number
}