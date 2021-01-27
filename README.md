# vue-freshchat

A reactive wrapper for [Freshchat's](https://www.freshworks.com/live-chat-software/) [JavaScript API](https://developers.freshchat.com/web-sdk/)

## Installation

```bash
npm install vue-freshchat
```

```javascript
import Vue from 'vue';
import VueFreshchat from 'vue-freshchat';

Vue.use(VueFreshchat, { appToken: 'your-freshchat-token' });
```

## Usage

`vue-freshchat` handles the injection of Freshchat's script into your html and wraps calls to the Freshchat API with methods and exposes them through the `$freshchat` object in your components.

```javascript
new Vue({
  el: '#main',
  data() {
    return {
      userExternalId: 1,
      userEmail: 'john@doe.com',
    };
  },
  mounted() {
    this.$freshchat.setExternalId(this.userExternalId);
    this.$freshchat.open();
  },
  watch: {
    userEmail() {
      this.$freshchat.setUserProperties({ email: this.userEmail });
    }
  }
});
```

## Example App

```
cd example
npm install
npm run dev
```

## API

### Values

#### `$freshchat.ready`

Set to `true` once the Freshchat script has been loaded.

#### `$freshchat.isOpen`

Set via the `opened`/`closed` events.

### Methods

#### `$freshchat.setExternalId(externalId)`

Calls `freshchat.setExternalId`.

#### `$freshchat.setUserProperties(options)`

Calls `freshchat.setProperties`.

#### `$freshchat.open(/*optional*/ payload)`

Calls `freshchat.open()`.

#### `$freshchat.close()`

Calls `freshchat.close()`.

#### `$freshchat.toggle()`

Calls `freshchat.open()` if the widget is closed and `freshchat.close()` if the widget is open.

#### `$freshchat.hideWidget()`

Will hide the widget bubble, and only show it when it's opened, use this property if you want to create your own personalized bubble

#### `$freshchat.showWidget()`

Will display the widget bubble if it has already been hidden

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020