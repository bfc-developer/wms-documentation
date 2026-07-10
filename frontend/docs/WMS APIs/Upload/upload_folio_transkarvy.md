# Upload New Folio TransKarvy
This API handles the uploading of new folio transaction data for Karvy. It generates a unique user ID, processes and merges data into `new_user_master`, `karvycamsfolioproductcode`, and `trans_karvy` collections, and finally removes the processed records from the temporary schema.

### User flow diagram
```mermaid
graph TD
    A[Start] --> B[Receive request with _id array]
    B --> C[Generate 7-digit uniqueNumber]
    C --> D[Aggregate from transKARVYNewSchema match _id]
    D --> E[Add fields: active, admin, userid, etc.]
    E --> F[Merge into new_user_master]
    F --> G[Aggregate from transKARVYNewSchema for product codes]
    G --> H[Merge into karvycamsfolioproductcode]
    H --> I[Aggregate from transKARVYNewSchema for transactions]
    I --> J[Merge into trans_karvy]
    J --> K[Remove processed records from transKARVYNewSchema]
    K --> L[Call syncKarvyAfterUpload]
    L --> M[Send Response 200 Success]
    D -- Error --> N[Send Response 500 with error message]
```

### Method
```
POST
```

### Route
```
/upload/upload-folio-transkarvy
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "_id": ["64f8a...", "64f8b..."]
}
```

### Response `Status: (200)`
```json
{
    "code": 200,
    "status": true,
    "message": "Success"
}
```

### Response `Status: (500)`
```json
{
    "code": 500,
    "status": false,
    "message": "<error message>"
}
```
