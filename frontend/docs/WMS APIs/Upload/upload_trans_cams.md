# Upload Trans Cams
This API processes and synchronizes CAMS transaction data from the temporary dump collection (`transCamsDump1`) into the main CAMS transaction table (`trans_cams`). It performs extensive data cleaning, enrichment, and synchronization, including handling reversals, updating nature types, mapping schemes, and syncing folio product codes.

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> DeleteTICOB[Delete TICOB Nature Type]
    DeleteTICOB --> HandleReversals[Identify and Delete Reversal Entries]
    HandleReversals --> UpdateNature[Update Nature Types<br/>Match with NatureTypeSchema]
    UpdateNature --> UpdateAssetDates[Update Asset Type, RM & Dates<br/>Add Time Offsets, Map RM]
    UpdateAssetDates --> MatchFolios[Match Existing Folios<br/>Enrich with Folio Details]
    MatchFolios --> HandleMissing[Handle Missing Folios<br/>Fetch Scheme/ISIN Details -> trans_cams_new]
    HandleMissing --> MergeTrans[Merge to trans_cams<br/>Insert/Update Valid Transactions]
    MergeTrans --> SyncProduct[Sync Folio Product Codes<br/>Update karvycamsfolioproductcode]
    SyncProduct --> SyncPostUpload[Sync Cams After Upload<br/>Trigger Post-Processing]
    SyncPostUpload --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-trans-cams
```
*(Note: Route prefix `/upload` assumed based on project structure. The route defined in code is `/upload-trans-cams` relative to the router).*

### Authorization
```
Bearer <token>
```

### Parameters
None. The API triggers processing of data already loaded into the staging collection `transCamsDump1` (and `transCamsDump1Schema`).

### Request Body
```json
{}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Success"
}
```

### Response `Status: (500)`
```json
{
    "success": false,
    "message": "<Error Message>"
}
```
