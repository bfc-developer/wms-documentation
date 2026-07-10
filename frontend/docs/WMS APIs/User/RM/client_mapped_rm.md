# Check Client Mapped RM
Determine which Relationship Manager (RM) is mapped to a specific client based on PAN or GPAN details.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> CheckInputs{Check Inputs}
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    CheckInputs -- "GPAN empty & PAN present" --> QueryPAN[Query: Find by PAN]
    CheckInputs -- "GPAN & Name present" --> QueryGPAN[Query: Find by GPAN & Name]
    CheckInputs -- Other --> Response400([Return 400 Bad Request: No data found])

    subgraph DB_Query
        QueryPAN --> FindOne[Find One in mappedrmSchema]
        QueryGPAN --> FindOne
        FindOne --> Select[Select RM Details]
    end

    Select --> Result{Result Found?}
    Result -- Yes --> Success[Prepare Success Payload]
    Result -- No --> Response404([Return 400: No data found])
    
    Success --> Response200([Return 200 OK: RM Details Found])
    
    FindOne -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/client-mapped-rm
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "pan": "ABCDE1234F",
    "gpan": "",
    "name": ""
}
```
OR
```json
{
    "pan": "",
    "gpan": "ABCDE1234F",
    "name": "Client Name"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "mappedRm": {
            "RM": "RM Name",
            "RMID": "RM123",
            "CLIENTNAME": "Client Name",
            "PAN": "ABCDE1234F",
            "GPAN": "ABCDE1234F",
            "ENTRY_DATE": "2024-01-01T10:00:00.000Z"
        }
    }
}
```

### Response `Status: (400)`
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
