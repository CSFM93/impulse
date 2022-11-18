## File structure

The `impulse.json` file should have the following structure:

```json
{
  "viewMethods": [],
  "changeMethods": []
}
```

Inside the `viewMethods` array you should declare your contracts `view` methods and in the `changeMethods` array the `change` methods.

Each array expects objects with the following structure:

```json
{
  "viewMethods": [
    {
      "name": "method name",
      "args": []
    }
  ],
  "changeMethods": [
    {
      "name": "method name",
      "args": []
    }
  ]
}
```

The `name` property is where you write the name of your `view` or `change` method. The `args` property is where you write the arguments.

The `args` property expects an object with the following properties :
- `name`: name of the argument.
- `value`: the value that the argument has.

The `value` property supports the following object types:
- `Strings`
- `Numbers`
- `Booleans`
- `Objects`

## Calling methods

Let's assume that you have a contract that allows users to create, read, and delete posts with the following methods:
- `create_post(post)`
- `get_posts()`
- `get_post_by_id(post_id)`
- `get_posts_by_visibility(is_visible)`
- `get_posts_by_title(title)`
- `delete_post(post_id)`

Each post object has the following structure:

```json
{
  "post_id": 0,
  "title": "post 1",
  "body": "post body",
  "is_visible": true
}
```

### Calling a method without arguments

If you only wanted to call the `get_posts` method you would have an `impulse.json` file that looks like the following:

```json
{
  "viewMethods": [
    {
      "name": "get_posts",
      "args": []
    }
  ],
  "changeMethods": []
}
```

### Calling a method that has a string as an argument

If you only wanted to call the `get_posts_by_title()` method you would have an `impulse.json` file that looks like the following:

```json
{
  "viewMethods": [
    {
      "name": "get_posts_by_title",
      "args": [
        {
          "name": "title",
          "value": "post 1"
        }
      ]
    }
  ],
  "changeMethods": []
}
```

### Calling a method that has a number as an argument

If you only wanted to call the `get_post_by_id()` and the `delete_post()` methods you would have an `impulse.json` file that looks like the following:

```json
{
  "viewMethods": [
    {
      "name": "get_post_by_id",
      "args": [
        {
          "name": "post_id",
          "value": 0
        }
      ]
    }
  ],
  "changeMethods": [
    {
      "name": "delete_post",
      "args": [
        {
          "name": "post_id",
          "value": 0
        }
      ]
    }
  ]
}
```

### Calling a method that has a boolean as an argument

If you only wanted to call the `get_posts_by_visibility()` method you would have an `impulse.json` file that looks like the following:

```json
{
  "viewMethods": [
    {
      "name": "get_posts_by_visibility",
      "args": [
        {
          "name": "is_visible",
          "value": true
        }
      ]
    }
  ],
  "changeMethods": []
}
```

### Calling a method that has an object as an argument

If you only wanted to call the `create_post()` method you would have an `impulse.json` file that looks like the following:

```json
{
  "viewMethods": [],
  "changeMethods": [
    {
      "name": "create_post",
      "args": [
        {
          "name": "post",
          "value": {
            "post_id": 0,
            "title": "post 1",
            "body": "post body",
            "is_visible": true
          }
        }
      ]
    }
  ]
}
```

### Putting all together

If you wanted to call all the methods mentioned above your complete `impulse.json` file would look similar to this :

```json
{
  "viewMethods": [
    {
      "name": "get_posts",
      "args": []
    },
    {
      "name": "get_posts_by_title",
      "args": [
        {
          "name": "title",
          "value": "post 1"
        }
      ]
    },
    {
      "name": "get_post_by_id",
      "args": [
        {
          "name": "post_id",
          "value": 0
        }
      ]
    },
    {
      "name": "get_posts_by_visibility",
      "args": [
        {
          "name": "is_visible",
          "value": true
        }
      ]
    }
  ],
  "changeMethods": [
    {
      "name": "create_post",
      "args": [
        {
          "name": "post",
          "value": {
            "post_id": 0,
            "title": "post 1",
            "body": "post body",
            "is_visible": true
          }
        }
      ]
    },
    {
      "name": "delete_post",
      "args": [
        {
          "name": "post_id",
          "value": 0
        }
      ]
    }
  ]
}
```
