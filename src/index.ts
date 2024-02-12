import { SDK } from '@ringcentral/sdk';
import { Subscriptions } from '@ringcentral/subscriptions';

// init
const sdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
const platform = sdk.platform();
const subscriptions = new Subscriptions({
  sdk: sdk,
});

const main = async () => {
  // login
  await platform.login({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN,
  });

  // subscribe
  const subscription = subscriptions.createSubscription();
  subscription.on(subscription.events.notification, (evt) => {
    console.log(JSON.stringify(evt, null, 2));
  });
  await subscription.setEventFilters(['/restapi/v1.0/account/~/extension/~/message-store']).register();

  // trigger events
  const r = await platform.get('/restapi/v1.0/account/~/extension/~');
  const ext = await r.json();
  platform.post('/restapi/v1.0/account/~/extension/~/company-pager', {
    from: { extensionId: ext.id },
    to: [{ extensionId: ext.id }],
    text: 'Hello world!',
  });
};

main();
