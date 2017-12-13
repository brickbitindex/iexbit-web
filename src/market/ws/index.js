import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://test.exchange.grootapp.com/cable');

cable.subscriptions.create({ channel: 'HallChannel', market: 'btccny' }, {
  // normal channel code goes here...
  received(data) {
    console.log(data);
  },
  connected() {
    console.log('connected');
  },
  disconnected() {
    console.log('disconnected');
  },
  rejected() {
    console.log('rejected');
  },
});
