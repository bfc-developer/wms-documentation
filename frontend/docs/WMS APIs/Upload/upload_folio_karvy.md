# Upload Folio KARVY
This API processes and synchronizes KARVY folio data from the temporary dump collection (`dummyfolio_karvy_dump1`) into the main system tables. It standardizes column names, performs data enrichment, updates existing records, creates new user profiles, and logs portfolio details.

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> StdCol[Standardize LASTUPDAT Column<br/>in dummyfolio_karvy_dump1]
    StdCol --> UpdateDump[Enrich Data in dummyfolio_karvy_dump1<br/>Update RM, Dates, Scheme Details, ISIN]
    UpdateDump --> UpdateFolio[Update Existing Folios in folio_karvy<br/>Merge logic with existing data]
    UpdateFolio --> UpdatePortfolio[Update foliowisePortfolio<br/>Sync Valid Pan Holders]
    UpdatePortfolio --> InsertUsers[Insert New Users into new_user_master<br/>Create profiles for new Folio/PAN combinations]
    InsertUsers --> InsertSchemes[Insert New Schemes into folio_karvy<br/>Add new schemes for existing users]
    InsertSchemes --> MergeSchemes[Update folioKARVYMergedSchemes]
    MergeSchemes --> GenUserID[Generate UserIDs<br/>Assign unique 6-digit ID for new users]
    GenUserID --> UpdateFolioID[Update UserID in folio_karvy<br/>Link Folios to UserIDs]
    UpdateFolioID --> InsertDetail[Insert into folio_detail<br/>Log recent entries]
    InsertDetail --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-folio-karvy
```
*(Note: Route prefix `/upload` assumed based on folder structure standard, or it might be root based on snippet. Please verify server mounting).*

### Authorization
```
Bearer <token>
```

### Parameters
None. The API triggers processing of data already loaded into the staging collection `dummyfolio_karvy_dump1`.

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
