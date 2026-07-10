# Delete AUM
Deletes all AUM (Assets Under Management) data from both the dump uploading and uploading collections in parallel.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> ParallelDelete[Execute Parallel Deletions]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    subgraph Parallel_Deletion
        ParallelDelete --> DeleteDump[Delete All from aumdumpuploading]
        ParallelDelete --> DeleteUpload[Delete All from aumuploading]
    end
    
    DeleteDump & DeleteUpload --> Response200([Return 200 OK: Deleted Successfully])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/delete-aum
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
GET: https://<host>/delete-aum
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Deleted Successfully"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
