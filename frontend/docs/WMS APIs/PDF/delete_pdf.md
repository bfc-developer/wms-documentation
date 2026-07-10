# Delete PDF
This API is used to clear the downloads folder of all generated PDF files. it scans the directory, filters for files with a `.pdf` extension, and deletes them asynchronously.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> ReadDir[Read downloadsPath folder]
    
    ReadDir --> FilterPDF[Filter for .pdf files]
    
    FilterPDF --> CheckFiles{PDF files found?}
    
    CheckFiles -- No --> Response404(["Return 404: No PDF found"])
    
    CheckFiles -- Yes --> LoopDelete[Loop through PDF files and delete]
    
    LoopDelete --> ProcessWait[Wait for all files to be processed]
    
    ProcessWait --> Response200(["Return 200 OK: PDF(s) deleted successfully"])
    
    ReadDir -. "Error" .-> HandleError[Catch Error]
    HandleError --> Response500(["Return 500 Internal Server Error"])
```

### Method
```
GET
```

### Route
```
/delete-pdf
```

### Authorization
```
Bearer <token>
```

### Sample Request
```http
GET: https://<host>/delete-pdf
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "PDF(s) deleted successfully."
}
```

### Response `Status: (404)`
```json
{
    "status": true,
    "message": "No PDF found."
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
