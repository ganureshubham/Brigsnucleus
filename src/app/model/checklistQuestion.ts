export interface checklistQuestion {
    title: string,
    questionTypeIdFK: number,
    checkListIdFK: number,
    options: questionOption[]
}

export interface questionOption {
    optionTitle: string,
    isDanger: Number
}