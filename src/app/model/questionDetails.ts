export interface questionDetails {
    Question: {
        questionId: number,
        questionDescription: string,
        questionTypeIdFK: number,
        questionType: string,
        isCompulsory: number,
        questionOptions: questionOption[]
    },
    message: string
}

export interface questionOption {
    questionOptionId: number,
    optionTitle: string,
    isDanger: number,
    referQuestionId: number,
    hasLinkedQuestion: number,
    linkedQuestion: {
        questionId: number,
        questionDescription: string
    }
}