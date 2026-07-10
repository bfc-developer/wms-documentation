# Upload New Folio Cams
This API confirms and processes specific new CAMS folios. It takes a list of selected portfolio IDs from the `folioCAMSNewSchema` (staging), merges them into the main `folio_cams` collection, and then removes them from the staging collection. This is typically used after a user reviews the "New Folio Cams List".

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> ReceiveIDs[Receive List of _ids]
    ReceiveIDs --> MatchNew[Match IDs in folioCAMSNewSchema]
    MatchNew --> MergeMain[Merge into folio_cams<br/>Match on PRODUCT & FOLIOCHK]
    MergeMain --> RemoveStaging[Delete Processed IDs from folioCAMSNewSchema]
    RemoveStaging --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-folio-cams-new
```
*(Note: Route prefix `/upload` assumed based on project structure).*

### Authorization
```
Bearer <token>
```

### Parameters
None.

### Request Body
```json
{
    "_id": [
        "ObjectId1",
        "ObjectId2",
        "ObjectId3"
    ]
}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "newFolios": [
            // List of processed/merged folio objects
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
