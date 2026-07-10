# Get SIP Expiry

This API retrieves a list of SIPs that are either due for registration or expiring within a specified date range. It allows filtering by transaction type and status (due/expiry).

### User flow diagram

```mermaid
graph TD
    Start([Start]) --> RecReq["Receive Request<br/>(startDate, endDate, type, trtype)"]
    RecReq --> CheckType{Check Type}
    
    CheckType -- "due" --> SetTypeDue["Set type = 'SIP REG'"]
    CheckType -- "expiry" --> SetTypeExp["Set type = 'SIP EXPIRY'"]
    
    SetTypeDue --> BuildQuery["Build Query<br/>Match TRTYPE, FILETYPE, ENDDATE range"]
    SetTypeExp --> BuildQuery
    
    BuildQuery --> FetchData["Fetch from sip_expiry Collection"]
    FetchData --> SortData["Sort by INVNAME"]
    SortData --> FormatData["Select Fields & Format Dates"]
    
    FormatData --> SendRes["Send Response<br/>(List of SIP Expiry)"]
    SendRes --> End([End])
```

### Method
```
POST
```

### Route
```
/get-sip-expiry
```

### Authorization
```
Bearer <token>
```

### Parameters
None.

### Request Body
```json
{
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "type": "due | expiry",
    "trtype": "String"
}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "length": 0,
        "sipExpiry": [
            {
                "ACNO": "String",
                "PRODCODE": "String",
                "AMOUNT": "Number",
                "INVNAME": "String",
                "EMAIL": "String",
                "IHNO": "String",
                "TRTYPE": "String",
                "STARTDATE": "DD-MM-YYYY",
                "ENDDATE": "DD-MM-YYYY",
                "TERMDATE": "DD-MM-YYYY",
                "SIPREGDT": "DD-MM-YYYY",
                "SCHEME": "String",
                "pan": "String",
                "FREQUENCY": "String",
                "MOBILE": "String"
            }
        ]
    }
}
```

### Response `Status: (500)`
```json
{
    "success": false,
    "message": "<Error Message>"
}
```
