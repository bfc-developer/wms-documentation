# Filter Client List
This API retrieves a complete (non-paginated) list of clients based on provided filters. It is designed for scenarios where the full set of matching clients is needed at once, such as for mass operations or exports within the email scheduler.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> FetchData[Call fetchClients Helper with paginate: false]
    
    subgraph fetchClients_Processing
        FetchData --> BuildMatch[Build Match Query based on filters, isAdmin, aum]
        BuildMatch --> RunCount[Count Total Documents]
        BuildMatch --> RunAggregate[Run Aggregation Pipeline]
        
        subgraph Pipeline_Steps
            RunAggregate --> Match[$match]
            Match --> AddressConcat[Address Concatenation Stage]
            AddressConcat --> Project[$project: Hide details]
        end
    end
    
    RunCount & Project --> CheckRows{Rows Found?}
    
    CheckRows -- Yes --> Response200([Return 200 OK: Client list found successful])
    CheckRows -- No --> Response404([Return 404: No data found])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/filter-client-list
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "filters": {
        "city": "Mumbai",
        "category": "High Net Worth"
    },
    "isAdmin": true,
    "aum": "equity"
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| filters | Object | **Optional.** Key-value pairs for filtering client data. |
| isAdmin | Boolean | **Optional.** Flag to indicate if the requesting user is an admin for query scoping. |
| aum | String | **Optional.** Criteria for AUM-based filtering. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Client list found successful",
    "payload": {
        "length": 5,
        "total": 5,
        "clientList": [
            {
                "_id": "60d5ec9f1a2b3c4d5e6f7a8b",
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "mobile": "9988776655",
                "address": "456 Avenue, Mumbai, 400001",
                "status": "Active"
            }
        ]
    }
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
