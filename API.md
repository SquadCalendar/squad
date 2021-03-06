## Models

### Admin

```json
{
  "id": "someAuthorToken",
  "eventId": "sid"
}
```

### Event

```json

{
  "id": "ID",
  "title": "some title",
  "description": "some description",
  "location": "some location",
  "duration": 1234332,
  "emails" : [
    "test@test.com",
    "email@email.com"
  ],
  "options": {
      "startTime": "count"
  }
}

```

# Endpoints

## /event

### POST :

create new event. Owned by logged in user if available.

<br>

__Request__:

```json

{
    "title": "some title",
    "description": "some description",
    "location": "some location",
    "duration": 12343,
    "emails" : [
      "test@test.com",
      "email@email.com"
    ],
    "options": [
      {
        "startTime": 12321242132
      }
    ],
    "users": ["1sdfj209332"]
}

```

__Response__:

An `Event`

## /vote/:id

### POST :
create a vote

<br>

__Request__:

```json
{
  "time": 1234234324
}
```
__Response__:
An `Event`

### DELETE :
delete a vote

<br>

__Request__:

```json
{
  "time": 1234234324
}
```
__Response__:
An `Event`
