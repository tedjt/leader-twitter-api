
# leader-twitter-api

  A [leader](https://github.com/ivolo/leader) plugin for the [Twitter](https://twitter.com/) API. Get a Twitter API key [here](https://apps.twitter.com).

## Example

```js
var Leader = require('leader');
var Twitter = require('leader-twitter-api');

var leader = Leader()
  .use(Twitter({
    key: 'CONSUMER_KEY',
    secret: 'CONSUMER_SECRET'
  }))
  .populate({ twitter: { username: 'abacadabra'}}, function(err, person) {
    // ..
});
```

It will search Twitter for the user and populate the following

And it will add the following to the `person`:

```js
{
  // ..
  twitter: {
    'name': 'name',
    'headline': 'headline',
    'location': 'location',
    'followers': 'followers',
    'following': 'following',
    'id': 'id',
    'tweets': 'tweets',
    'url': 'url'
  }
}
```

## API

#### Twitter(apiKey)

  Return a Leader plugin for the Twitter API.
