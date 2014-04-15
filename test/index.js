
var assert = require('assert');
var plugin = require('..');

describe('leader-twitter-api', function () {
  this.timeout(1000 * 60);

  var twitter = plugin({
    key: 'clKksanAwv0kDGj9iSyoZA',
    secret: 'A2JciztNJsrXJm2CQoB55b64ECW9JaD3LaWwTm8CU',
  });

  it('should wait if theres no twitter username', function () {
    var context = {}, person = {};
    assert(!twitter.wait(person, context));
  });

  it('should not wait if there is a twitter username', function () {
    var person = { twitter: { username: 'tlbtlbtlb'}};
    var context = {};
    assert(twitter.wait(person, context));
  });

  it('should be able to resolve a valid twitter user profile', function (done) {
    var person = { twitter: { username: 'tlbtlbtlb'}};
    var context = {};
    twitter.fn(person, context, function (err) {
      if (err) return done(err);
      console.log(person);
      assert(person.twitter);
      assert(person.twitter.followers);
      done();
    });
  });
});
