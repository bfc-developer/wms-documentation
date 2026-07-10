# Get New Folio Karvy List
This API retrieves a list of new KARVY folios from the `folioKARVYNewSchema` collection. These are typically folios that have been newly identified during an upload process and may require verification or further processing. The response maps specific fields (e.g., `ACNO` -> `FOLIOCHK`, `ADD1` -> `ADDRESS1`).

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> FetchData[Fetch All Records from folioKARVYNewSchema]
    FetchData --> MapFields[Map Fields<br/>ACNO->FOLIOCHK<br/>ADD1->ADDRESS1<br/>PRCODE->PRODUCT etc.]
    MapFields --> Return[Return List of New Folios]
    Return --> End([End])
```

### Method
```
GET
```

### Route
```
/upload/new-foliokarvy-list
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
{}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "length": <number_of_items>,
        "newFolios": [
            {
                "_id": "ObjectId",
                "FOLIOCHK": "String (Mapped from ACNO)",
                "ADDRESS1": "String (Mapped from ADD1)",
                "ADDRESS2": "String (Mapped from ADD2)",
                "ADDRESS3": "String (Mapped from ADD3)",
                "EMAIL": "String (Mapped from EMAIL)",
                "GUARD_PAN": "String (Mapped from GUARDPANNO)",
                "INV_NAME": "String (Mapped from INVNAME)",
                "PAN_NO": "String (Mapped from PANGNO)",
                "PRODUCT": "String (Mapped from PRCODE)"
            }
            // ... more items
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
