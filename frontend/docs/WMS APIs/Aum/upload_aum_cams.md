# Upload AUM CAMS
Uploads AUM (Assets Under Management) data for CAMS RTA by clearing existing dump data, inserting new Excel data, calculating AUM from the dump, updating AMC-wise AUM totals, and updating AMC short names.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> DeleteDump[Delete Existing aumdumpuploading Data]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    DeleteDump --> ExtractData[Extract Excel Data from Request Body]
    
    ExtractData --> InsertData[Insert Excel Data into aumdumpuploading]
    
    InsertData --> CalcAUM[Execute calculateaumcamsdump Function]
    
    CalcAUM --> UpdateAMC[Execute updateamcwiseaum for CAMS]
    
    UpdateAMC --> UpdateShortname[Execute updateamcshortname Function]
    
    UpdateShortname --> Response200([Return 200 OK: Successfully upload])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/upload-aum-cams
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
[
    {
        "field1": "value1",
        "field2": "value2",
        "field3": "value3"
    },
    {
        "field1": "value1",
        "field2": "value2",
        "field3": "value3"
    }
]
```

**Note:** Request body should contain an array of AUM data objects extracted from Excel file.

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successfully upload"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
