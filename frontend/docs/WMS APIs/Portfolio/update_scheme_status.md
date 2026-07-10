# Update Scheme Status
Updates scheme status from "Pending" to active status for both KARVY and CAMS RTAs by syncing scheme details from scheme_details collection, updating ACCORD_AMFICODE, ACCORD_AMFINAME, and ACCORD_STATUS fields in transaction and folio tables, and merging folio-productcode data into the unified karvycamsfolioproductcode table.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> CheckKarvy[Check KARVY Pending Schemes]
    
    CheckKarvy -- Found --> ProcessKarvy[Process KARVY Updates]
    CheckKarvy -- None --> CheckCams[Check CAMS Pending Schemes]
    
    subgraph KARVY_Processing
        ProcessKarvy --> AggKarvyFolio[Aggregate Folio-Product Combinations]
        AggKarvyFolio --> LookupKarvyFolio[Lookup folio_karvy by ACNO & PRCODE]
        LookupKarvyFolio --> MergeKarvyFolio[Merge to karvycamsfolioproductcode]
        MergeKarvyFolio --> LookupKarvyScheme[Lookup scheme_details by cams_code]
        LookupKarvyScheme --> UpdateKarvyTrans[Update trans_karvy ACCORD Fields]
        UpdateKarvyTrans --> UpdateKarvyFolio[Update folio_karvy ACCORD Fields]
        UpdateKarvyFolio --> SyncKarvy[Execute syncKarvyAfterUpload]
    end
    
    SyncKarvy --> CheckCams
    
    CheckCams -- Found --> ProcessCams[Process CAMS Updates]
    CheckCams -- None --> CombineResults[Combine Results]
    
    subgraph CAMS_Processing
        ProcessCams --> AggCamsFolio[Aggregate Folio-Product Combinations]
        AggCamsFolio --> LookupCamsFolio[Lookup folio_cams by FOLIOCHK & PRODUCT]
        LookupCamsFolio --> MergeCamsFolio[Merge to karvycamsfolioproductcode]
        MergeCamsFolio --> LookupCamsScheme[Lookup scheme_details by cams_code]
        LookupCamsScheme --> UpdateCamsTrans[Update trans_cams ACCORD Fields]
        UpdateCamsTrans --> UpdateCamsFolio[Update folio_cams ACCORD Fields]
        UpdateCamsFolio --> SyncCams[Execute syncCamsAfterUpload]
    end
    
    SyncCams --> CombineResults
    
    CombineResults --> CheckData{Any Pending Found?}
    
    CheckData -- Yes --> Response200([Return 200 OK: Success])
    CheckData -- No --> Response404([Return 404: No Pending Scheme])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/update-scheme-status
```

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| None | - | - |

### Sample Request
```http
GET: https://<host>/update-scheme-status
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No Pending Scheme"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
