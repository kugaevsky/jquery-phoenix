# Phoenix
#### jQuery plugin to save form fields values to localStorage

Lost connections, crashed browsers, broken validations – all these shit loose
forms data you've filled in with love and care.

**[Phoenix](https://github.com/kugaevsky/jquery-phoenix/)** keeps bad things away from your forms. It saves form fields values to localStorage using HTML5 Web Storage API.

Enough words! Take a look at

## Demo

[![Phoenix Demo](http://storage.kugaevsky.ru/images/Phoenix__jQuery_plugin_to_store_form_fields_values_via_Web_Storage_API_20131220_222119.png)](http://kugaevsky.github.io/jquery-phoenix/)

[Try the DEMO!](http://kugaevsky.github.io/jquery-phoenix/)

## Requirements

It's jQuery plugin so it requires [jQuery](http://jquery.com/).

## Usage

1. Require jQuery
2. Require jquery.phoenix.js
3. `$(selector).phoenix()` – cast the magic
4. `$(selector).phoenix('remove')` – clear storage on successful form submission (or any other event your like more)

Something like this

    <form id='my-form'>
      <input type="text" class="phoenix-input" />
      <textarea type="text" class="phoenix-input"></textarea>
    </div>

    <script type="text/javascript">
      $('.phoenix-input').phoenix()
      $('#my-form').submit(function(e){
        $('.phoenix-input').phoenix('remove')
      })
    </script>


Do take a look at [demo file source](https://github.com/kugaevsky/jquery-phoenix/blob/master/index.html) to understand usage.

## API

Phoenix provides simple but flexible API.

### Options

You can pass an options object on phoenix initialization.

`$('.phoenix-input').phoenix({namespace: 'phoenixStorage', maxItems: 50, saveInterval: 1000})`

Possible options are:

* `namespace` – localStorage namespace (if you don't like default) – default: `phoenixStorage`,
* `maxItems` – max items to store (every form field is an item) – default: `50`,
* `saveInterval` – how often to save field values to localStorage (milliseconds) – default: `1000`

### Methods

When Phoenix initialized you can use API methods to manage it.
Call method with `$(selector).phoenix('methodName')`, where `methodName` is one of these:

* `start` – start saving timer, it will save field values every `saveInterval`ms (saveInterval is an option as you remember)
* `stop` – stop saving timer
* `load` – load value from stored item to field
* `save` – save value from field to stored item
* `remove` – stop saving timer and remove stored item from localStorage

**NB** Phoenix doesn't remove stored item from localStorage by itself. So don't forget to call `remove` on successful form submission or any other event when you don't need filled in form field values anymore.

### Events

Every Phoenix method call fires an event you can bind to.
For example

    $('.phoenix-input').bind('phnx.loaded', function (e) {
      console.log('Data loaded... ')
    })

Events naming is very obvious, so try them out

* phnx.started
* phnx.stopped
* phnx.loaded
* phnx.saved
* phnx.removed

### License

Distributed under [MIT license](https://github.com/kugaevsky/jquery-phoenix/blob/master/LICENSE)

### Contributing

Feel free to create pull request of your changes. But only in [CoffeeScript](http://jashkenas.github.io/coffee-script/).
