export interface complaintList {

    "currentPage": string,
    "totalCount": number,
    "totalComplaints": number,
    "complaintList": [
        {
            "complaintId": number,
            "title": string,
            "typeOfComplaint": string,
            "assetTitle": string,
            "assetCode": string,
            "complaintStatus": string,
            "typeOfUser": string,
            "raisedByName": string
        }

    ],
    "message": string

}

