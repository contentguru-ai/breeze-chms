import People from './people.js';
import Account from './account.js';
import { BreezeHttpClient } from './client.js';

/** Valid Breeze subdomain: alphanumeric labels separated by hyphens (no leading/trailing hyphens). */
const SUBDOMAIN_RE = /^[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

export default class Breeze {
  /**
   * Initialize this class to interface with [Breeze API](https://app.breezechms.com/api).
   *
   * @param  subdomain
   * Enter your Breeze subdomain.
   *
   * (_You can find this in your web address bar when logged
   * into Breeze: `YOURSUBDOMAIN.breezechms.com`_)
   *
   * @param  key
   * Enter your unique/secret API key.
   *
   * (_You can find this on the `Extensions` page of your Breeze account:
   * `https://YOURSUBDOMAIN.breezechms.com/extensions/api`_)
   *
   * @returns Instance of callable Breeze API wrapper.
   */
  constructor(subdomain: string, key: string) {
    if (!subdomain || !SUBDOMAIN_RE.test(subdomain)) {
      throw new Error(
        'Invalid subdomain: must contain only alphanumeric characters and hyphens.',
      );
    }
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid API key: must be a non-empty string.');
    }
    const client = new BreezeHttpClient(`https://${subdomain}.breezechms.com/api/`, key);
    this.people = new People(client);
    this.account = new Account(client);
  }

  /** List, get, add, update, and delete people in Breeze.
   *
   * [API REF](https://app.breezechms.com/api#people) */
  people: People;

  /** Retrieve Breeze account details and activity log.
   *
   * [API REF](https://app.breezechms.com/api#account) */
  account: Account;
}
