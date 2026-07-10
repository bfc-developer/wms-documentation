# Portfolio Summary
This API is used to generate a comprehensive portfolio summary PDF. It handles HTML content rendering, chart generation, caching of previously generated PDFs, and gzipped delivery of the final document.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> ReceiveReq[Receive POST Request]
    ReceiveReq --> DataProcessing[Process Input Data]
    DataProcessing --> GenChart[Generate Chart Base64]
    GenChart --> RenderHTML[Build HTML Content]
    RenderHTML --> CalcHash[Create MD5 Hash of HTML]
    CalcHash --> CheckCache{File exists in Cache?}
    
    CheckCache -- Yes --> ReadCache[Read PDF from Disk]
    ReadCache --> GzipCache[Compress with Gzip]
    GzipCache --> ReturnCache([Return Compressed PDF])
    
    CheckCache -- No --> BuildPDF[Generate PDF via Puppeteer]
    BuildPDF --> SaveDisk[Save PDF to Disk]
    SaveDisk --> GzipNew[Compress with Gzip]
    GzipNew --> ReturnNew([Return Compressed PDF])
    
    ReceiveReq -. Error .-> HandleError[Catch Error]
    HandleError --> Response500(["Return 500 Internal Server Error"])
```

### Method
```
POST
```

### Route
```
/getsummary
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "name": "Client Name",
    "clientTotal": {
        "mutualFund": 100000,
        "equity": 50000,
        "total": 150000
    },
    "total": {
        "percentages": [40, 30, 30],
        "grandTotal": 150000
    }
}
```

### Response `Status: (200)`
```
Content-Type: application/pdf
Content-Encoding: gzip
Content-Disposition: attachment; filename="<client-name>-<hash>.pdf"
```
The response body is a binary stream of the gzipped PDF file.

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Error message details"
}
```
