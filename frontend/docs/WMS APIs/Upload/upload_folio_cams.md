# Upload Folio CAMS
This API processes and synchronizes CAMS folio data from the temporary dump collection (`dummyfolio_cams_dump1`) into the main system tables. It performs data enrichment, updates existing records, creates new user profiles, and logs portfolio details.

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> UpdateDump[Enrich Data in dummyfolio_cams_dump1<br/>Update RM, Dates, Scheme Details, ISIN]
    UpdateDump --> UpdateFolio[Update Existing Folios in folio_cams<br/>Merge logic with existing data]
    UpdateFolio --> UpdatePortfolio[Update foliowisePortfolio<br/>Sync Valid Pan Holders]
    UpdatePortfolio --> InsertUsers[Insert New Users into new_user_master<br/>Create profiles for new Folio/PAN combinations]
    InsertUsers --> InsertSchemes[Insert New Schemes into folio_cams<br/>Add new schemes for existing users]
    InsertSchemes --> MergeSchemes[Update folioCAMSMergedSchemes]
    MergeSchemes --> GenUserID[Generate UserIDs<br/>Assign unique 6-digit ID for new users]
    GenUserID --> UpdateFolioID[Update UserID in folio_cams<br/>Link Folios to UserIDs]
    UpdateFolioID --> InsertDetail[Insert into folio_detail<br/>Log recent entries]
    InsertDetail --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-folio-cams
```
*(Note: Route prefix `/upload` assumed based on typical structure, or it might be root `/upload-folio-cams` based on the snippet provided. Adjust based on actual route mounting).* 
*Based on request snippet: `router.post('/upload-folio-cams', ...)`* 

### Authorization
```
Bearer <token>
```

### Parameters
None. The API triggers processing of data already loaded into the staging collection `dummyfolio_cams_dump1`.

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
