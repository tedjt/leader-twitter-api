var debug = require('debug')('leader:twitter:api');
var extend = require('extend');
var leaderUtils = require('leader-utils');
var objCase = leaderUtils.objcase;
var Twitter = require('mtwitter');
var map = require('map');

/**
 * Create a new leader plugin.
 *
 * @params {Object} options
 * @returns {Object}
 */

module.exports = function (options) {
  return { fn: middleware(options), wait: wait};
};

/**
 * Create a Titter leader plugin.
 *
 * @return {String} apiKey
 * @return {Function}
 */

function middleware (options) {
  var twitter = Twitter({
    consumer_key: options.key,
    consumer_secret: options.secret,
    application_only: true
  });

  return function twitterApi (person, context, next) {
    var username = getUsername(person, context);
    if (!username) return next();
    debug('requesting twitter api profile with username %s ..', username);
    twitter.get('/users/show', {screen_name: username}, function(err, item) {
      if (err) return next(err);
      if (!item) return next();
      var subset = general(item, person);
      extend(true, context, { twitterapi : subset});
      extend(true, person.twitter, subset);
      debug('twitter profile for %s has been populated', username);
      next();
    });
  };
}

/**
 * Copy the Twitter general `profile` to the `person`.
 *
 * @param {Object} profile
 * @param {Object} person
 */
function general (profile, person) {
  var general = map(profile, {
    'name': 'name',
    'headline': 'description',
    'location': 'location',
    'image_url': 'profile_image_url',
    'followers': 'followers_count',
    'friends': 'friends_count',
    'id': 'id',
    'tweets': 'statuses_count',
    'personal_url': 'url'
  });
  if (!general.person_url || general.personUrl.indexOf('t.co') !== -1) {
    var candidate = objCase(profile, 'entities.url.urls[0].expanded_url');
    if (candidate) {
      general.personal_url = candidate;
      var cleanDomain = (objCase(profile, 'entities.url.urls[0].display_url') || leaderUtils.getCleanDomain(candidate)).trim();
      var interestingDomain = isInterestingDomain(cleanDomain);
      if (interestingDomain) {
        if (!objCase(person, 'domain.name')) {
          person.domain = {name: cleanDomain, personal:false, disposable:false, interesting: true};
        }
        if (!objCase(person, 'company.website')) {
          person.company = person.company || {};
          person.company.website = candidate
        }
      }
    }
  }
  return general;
}

/**
 * Wait until we have a twitter username.
 *
 * param {Object} person
 * param {Object} context
 * @return {Boolean}
 */

function wait (person, context) {
  return getUsername(person, context);
}

/**
 * Get the twitter username.
 *
 * param {Object} person
 * param {Object} context
 * @return {String}
 */

function getUsername (person, context) {
  return objCase(person, 'twitter.username');
}

var notInterestingDomains = [
  'blogspot.com',
  'tumblr.com',
  '.me',
  'facebook.com',
  'soundcloud.com',
  'ebay',
  'youtu.be',
  'youtube.com',
  'instagram.com',
  'etsy.com'
];
function isInterestingDomain(domain) {
  var lowerDomain = domain.toLowerCase();
  return notInterestingDomains.every(function(d) {
    return lowerDomain.indexOf(d) === -1;
  });
}
