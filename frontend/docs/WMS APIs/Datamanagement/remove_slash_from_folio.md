# Remove Slash From Folio
This API is used to clean up folio numbers by removing the characters following a forward slash (`/`). It updates the folio numbers across multiple collections including folios, transactions, and portfolios for a specific RTA and AMC.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Validate{Validate Pattern contains '/'}
    
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    Validate -- Valid --> ExtractPattern[Extract part before '/']
    
    ExtractPattern --> CheckRTA{Check RTA Type}
    
    subgraph CAMS_Cleanup [RTA: CAMS]
        CheckRTA -- CAMS --> AggregateCAMS[Backup CAMS folios to karvycamsfolioproductcode]
        AggregateCAMS --> UpdateFolioc[Update folioc: Remove slash]
        UpdateFolioc --> UpdateTransc[Update transc: Remove slash]
    end
    
    subgraph KARVY_Cleanup [RTA: KARVY]
        CheckRTA -- KARVY --> UpdateFoliok[Update foliok: Remove slash]
        UpdateFoliok --> UpdateTransk[Update transk: Remove slash]
    end
    
    UpdateTransc & UpdateTransk --> UpdateCommon[Update client_foliodetail & folioWise_portfolio]
    
    UpdateCommon --> Sync[Trigger syncCamsAfterUpload]
    
    Sync --> CheckModified{Total Records Modified > 0?}
    
    CheckModified -- Yes --> Response200([Return 200 OK: Success with counts])
    CheckModified -- No --> Response404([Return 404: No data found])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/remove-slash-from-folio
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "rta": "CAMS",
    "amc": "HDFC Mutual Fund",
    "action": "Cleanup",
    "pattern": "12345/678"
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| rta | String | The registrar (e.g., "CAMS", "KARVY"). |
| amc | String | The AMC name/pattern to filter records. |
| action | String | Optional action description. |
| pattern | String | The folio pattern containing the slash to be removed. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success - 15 records updated"
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Folio number does not contain '/', nothing to remove"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data found for update"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
