# Get New Folio TransKarvy List
This API retrieves a list of new folios from Karvy transactions, selecting specific fields like Folio Check, Investor Name, PAN Number, Scheme, and Product.

### User flow diagram
```mermaid
graph TD
    A[Start] --> B[Fetch new folios from transKARVYNewSchema]
    B --> C{Data Found?}
    C -- Yes --> D[Select fields: _id, FOLIOCHK, INV_NAME, PAN_NO, SCHEME, PRODUCT]
    C -- No --> E[Return empty list]
    D --> F[Send Response 200 with newFolios list]
    E --> F
    B -- Error --> G[Send Response 500 with error message]
```

### Method
```
GET
```

### Route
```
/upload/new-folio-transkarvy-list
```
*Note: Route prefix '/upload' is assumed based on folder structure request, please verify if it belongs to a specific route group like '/api/upload' or similar.*

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| | | No parameters required |

### Sample Request
```http
GET: https://<host>/upload/new-folio-transkarvy-list
```

### Response
```json
{
    "code": 200,
    "status": true,
    "message": "Successful",
    "data": {
        "length": 1,
        "newFolios": [
            {
                "_id": "64f8a...",
                "FOLIOCHK": "12345678",
                "INV_NAME": "JOHN DOE",
                "PAN_NO": "ABCDE1234F",
                "SCHEME": "Equity Fund",
                "PRODUCT": "EQ"
            }
        ]
    }
}
```
