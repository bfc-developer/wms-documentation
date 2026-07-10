# Unmapped RM List
Retrieve a list of clients who are not mapped to any Relationship Manager (RM) based on activity in the last 30 days.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> CalcDate[Calculate Date: 30 days ago]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    CalcDate --> Parallel[Execute Parallel Queries]

    subgraph Sources
        FolioC[Folio CAMS: RMID='', PAN/GuardPAN exists, >= Date]
        TransC[Trans CAMS: RMID='', PAN exists, >= Date]
        FolioK[Folio Karvy: RMID='', PAN/GuardPAN exists, >= Date]
        TransK[Trans Karvy: RMID='', PAN exists, >= Date]
    end

    Parallel --> FolioC
    Parallel --> TransC
    Parallel --> FolioK
    Parallel --> TransK

    FolioC --> Combine[Combine Results]
    TransC --> Combine
    FolioK --> Combine
    TransK --> Combine

    Combine --> Unique[Filter Unique Clients by Name+PAN]
    Unique --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: Clients Retrieved])

    Parallel -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/user/unmapped-rm-list
```

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| - | - | No parameters required |

### Sample Request
```http
GET /user/unmapped-rm-list HTTP/1.1
Host: <host>
Authorization: Bearer <token>
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Unmapped clients retrieved successfully",
    "payload": {
        "length": 1,
        "unmappedClients": [
            {
                "NAME": "Client Name",
                "PAN": "ABCDE1234F",
                "MOBILE": "9876543210",
                "EMAIL": "client@example.com",
                "DATE": "2024-01-01T10:00:00.000Z"
            }
        ]
    }
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
