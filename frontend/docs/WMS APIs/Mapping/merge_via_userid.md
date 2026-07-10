# Merge Client Via UserID
Merges multiple client records into a single selected client record based on user IDs. This operation consolidates data across multiple collections including folios (CAMS and KARVY), transactions (CAMS and KARVY), portfolio data, folio details, and RM mappings. The selected client's information (name, PAN, RM details) is applied to all merged records, and the merging client records are deleted from the user master.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request[Receive POST Request]
    
    Request --> ValidateInput{Validate Input}
    
    ValidateInput -->|Invalid mergingIds| Response400A([Return 400: Invalid mergingIds])
    ValidateInput -->|Invalid selectedId| Response400B([Return 400: Invalid selectedId])
    ValidateInput -->|Valid| FindSelected[Find Selected User Data]
    
    FindSelected --> CheckSelected{Selected User Exists?}
    CheckSelected -->|No| Response404([Return 404: Selected user not found])
    CheckSelected -->|Yes| GetSelectedData[Get mappedname, pan, userid, rm, rmid]
    
    GetSelectedData --> ParallelMerge[Start Parallel Merge Operations]
    
    subgraph CAMS_Collections ["CAMS Collections"]
        MergeFolioCams[Merge folio_cams Collection]
        UpdateFolioCams[Update with selected user data]
        MergeFolioCams --> UpdateFolioCams
        
        MergeTransCams[Merge trans_cams Collection]
        UpdateTransCams[Update with selected user data]
        MergeTransCams --> UpdateTransCams
    end
    
    subgraph KARVY_Collections ["KARVY Collections"]
        MergeFolioKarvy[Merge folio_karvy Collection]
        UpdateFolioKarvy[Update with selected user data]
        MergeFolioKarvy --> UpdateFolioKarvy
        
        MergeTransKarvy[Merge trans_karvy Collection]
        UpdateTransKarvy[Update with selected user data]
        MergeTransKarvy --> UpdateTransKarvy
    end
    
    subgraph Portfolio_Collections ["Portfolio and Folio Collections"]
        MergeFolioWise[Merge foliowisePortfolio Collection]
        UpdateFolioWise[Update with selected user data]
        MergeFolioWise --> UpdateFolioWise
        
        MergeFolioDetail[Merge folio_detail Collection]
        UpdateFolioDetail[Update with selected user data]
        MergeFolioDetail --> UpdateFolioDetail
    end
    
    subgraph RM_Mapping ["RM Mapping"]
        UpdateRMMapping[Update mapped_rm Collection]
        SetRMData[Set CLIENTNAME, PAN, USER_ID]
        UpdateRMMapping --> SetRMData
    end
    
    ParallelMerge --> MergeFolioCams
    ParallelMerge --> MergeTransCams
    ParallelMerge --> MergeFolioKarvy
    ParallelMerge --> MergeTransKarvy
    ParallelMerge --> MergeFolioWise
    ParallelMerge --> MergeFolioDetail
    ParallelMerge --> UpdateRMMapping
    
    UpdateFolioCams --> CheckDuplicateRM{Check for Duplicate RM Mappings}
    UpdateTransCams --> CheckDuplicateRM
    UpdateFolioKarvy --> CheckDuplicateRM
    UpdateTransKarvy --> CheckDuplicateRM
    UpdateFolioWise --> CheckDuplicateRM
    UpdateFolioDetail --> CheckDuplicateRM
    SetRMData --> CheckDuplicateRM
    
    CheckDuplicateRM -->|Multiple mappings found| DeleteDuplicateRM[Delete duplicate RM mapping]
    CheckDuplicateRM -->|No duplicates| DeleteUsers[Delete merging user records]
    DeleteDuplicateRM --> DeleteUsers
    
    DeleteUsers --> Response200([Return 200: Merge Successfully])
    
    Request -.Error.-> HandleError[Catch Error]
    HandleError --> Response500([Return 500: Internal Server Error])
```

### Method
```
POST
```

### Route
```
/merge-via-userid
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "seletedId": 12345,
    "mergingIds": [67890, 11111, 22222]
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| seletedId | Number | The user ID of the selected client whose data will be retained and applied to merged records. |
| mergingIds | Array<Number> | Array of user IDs to be merged into the selected client. These records will be deleted after merge. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Merge Successfully"
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Invalid mergingIds"
}
```

```json
{
    "status": false,
    "message": "Invalid selectedId"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "Selected user not found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Error message details"
}
```

## Merge Operations Details

### Collections Updated
1. **folio_cams** - CAMS folio records
   - Match criteria: `FOLIOCHK`, `PRODUCT`
   - Updates: `INV_NAME`, `PAN_NO`, `USER_ID`, `userid`, `RMID`, `RM`, `MERGE_DATE`

2. **folio_karvy** - KARVY folio records
   - Match criteria: `ACNO`, `PRCODE`
   - Updates: `INVNAME`, `PANGNO`, `USER_ID`, `userid`, `RMID`, `RM`, `MERGE_DATE`

3. **trans_cams** - CAMS transaction records
   - Match criteria: `FOLIO_NO`, `PRODCODE`, `TRXNNO`, `NATURE`, `PURPRICE`
   - Updates: `INV_NAME`, `PAN`, `USER_ID`, `userid`, `RMID`, `RM`, `MERGE_DATE`

4. **trans_karvy** - KARVY transaction records
   - Match criteria: `TD_ACNO`, `FMCODE`, `TD_TRNO`, `NATURE`, `TRFLAG`, `TD_UNITS`
   - Updates: `INVNAME`, `PAN1`, `USER_ID`, `userid`, `RMID`, `RM`, `MERGE_DATE`

5. **foliowisePortfolio** - Portfolio data by folio
   - Match criteria: `folio`, `productcode`
   - Updates: `name`, `pan`, `USER_ID`, `userid`, `RMID`, `RM`, `MERGE_DATE`

6. **folio_detail** - Folio detail records
   - Match criteria: `folio`, `product`
   - Updates: `mappedname`, `userid`, `MERGE_DATE`

7. **mapped_rm** - RM mapping records
   - Updates all records with merging user IDs
   - Sets: `CLIENTNAME`, `PAN`, `USER_ID`, `MERGE_DATE`
   - Removes duplicates if multiple mappings exist for selected user

8. **new_usermaster** - User master records
   - Deletes all records with user IDs in `mergingIds` array

### Merge Strategy
- **whenMatched**: `replace` - Existing records are replaced with updated data
- **whenNotMatched**: `discard` - No new records are inserted, only existing records are updated
- All merge operations add a `MERGE_DATE` timestamp field with the current date/time
