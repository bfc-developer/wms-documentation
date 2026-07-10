# Upload Trans Karvy
This API processes and synchronizes KARVY transaction data from the temporary dump collection (`transKarvyDump1`) into the main KARVY transaction table (`trans_karvy`). It handles data cleaning, reversals, nature type mapping, folio matching, and product code synchronization.

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> DeleteReversals[Delete Reversals<br/>Negative Units/Amount or 'rej']
    DeleteReversals --> DeleteNature[Delete Specific Nature Types<br/>TMO, TMI, RFD, etc.]
    DeleteNature --> UpdateNature[Update Nature Types<br/>Match with natureTypeSchema]
    UpdateNature --> UpdateTrFlag[Update TRFLAG Nature<br/>'TO' -> Switch Out]
    UpdateTrFlag --> UpdateValues[Update Asset Type, RM & Dates<br/>Add Time Offsets, Map RM]
    UpdateValues --> MatchFolios[Match Existing Folios<br/>Enrich with Folio Details]
    MatchFolios --> HandleMissing[Handle Missing Folios<br/>Fetch Scheme/ISIN Details -> trans_karvy_new]
    HandleMissing --> MergeTrans[Merge to trans_karvy<br/>Insert/Update Valid Transactions]
    MergeTrans --> SyncProduct[Sync Folio Product Codes<br/>Update karvycamsfolioproductcode]
    SyncProduct --> SyncMissingProduct[Sync Missing Folio Product Codes]
    SyncMissingProduct --> SyncPostUpload[Sync Karvy After Upload<br/>Trigger Post-Processing]
    SyncPostUpload --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-trans-karvy
```
*(Note: Route prefix `/upload` assumed based on project structure. The route defined in code is `/upload-trans-karvy` relative to the router).*

### Authorization
```
Bearer <token>
```

### Parameters
None. The API triggers processing of data already loaded into the staging collection `transKarvyDump1` (and `transKarvyDump1Schema`).

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
