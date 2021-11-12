# SCORE_API #

"SCORE_API" is an API working with the "no-name" game project by Ynov student.

The API can be configured using the config.json file.
Inside this file you will find all the necessary information to connect to the Scenarium project database.

`Example config.json`
```JSON
{
    "mode": "local",
    "user": "myUser",
    "pass": "myPass",
    "host": "myHost",
    "name": "databaseName",
    "port": 3042,
    "type": "mysql"
}
```

## Path ##

### Level ###
All path begin by main path and `/levels`

- GET `/` :
Return all Levels in DB

- GET `/:id`
Return a level by its id level

### Player ###
All path begin by main path and `/players`

- GET `/` :
Return all players in DB

- GET `/:id`
Return a level by its id player

### Score ###
All path begin by main path and `/scores`

- GET `/` :
Return all scores in DB

- GET `/player/:id`
Return all score in db by id player

- GET `/level/:id`
Return all score in db by id level. Score are order by ASC timed.

Optional parameter :
- limit
- offset