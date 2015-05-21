# Phoenix [![Code Climate](https://codeclimate.com/github/kugaevsky/jquery-phoenix.png)](https://codeclimate.com/github/kugaevsky/jquery-phoenix) [![endorse](https://api.coderwall.com/kugaevsky/endorsecount.png)](https://coderwall.com/kugaevsky)

#### jQuery plugin that saves form state to Local Storage via HMTL5 Web Storage APIs

Lost connections, crashed browsers, broken validations – all these
shit lose forms data you've filled in with love and care.

Phoenix is a jQuery plugin that saves data entered inside form fields
locally and restores it in case the browser crashes or the page is refreshed accidentally.

**[Phoenix](https://github.com/kugaevsky/jquery-phoenix/)** keeps
bad things away from your forms. It is very tiny – 3Kb (1Kb gziped),
but powerful. Phoenix saves form fields values, checkboxes and radio button states
to your browser Local Storage using HTML5 Web Storage API.

If at any point the Internet connection goes offline, the browser crashes,
the page is refreshed or the form doesn't validate, the user filling in the form
can restore the form to his last version instead of re-filling all the form fields again.

Enough words! Take a look at

## Demo

[![Phoenix Demo](http://kugaevsky.github.io/jquery-phoenix/demo.png)](http://kugaevsky.github.io/jquery-phoenix/)

[Try the DEMO!](http://kugaevsky.github.io/jquery-phoenix/)

## Requirements

It's jQuery plugin so it requires [jQuery](http://jquery.com/).

## Installation

Clone from source, [download](https://raw.github.com/kugaevsky/jquery-phoenix/master/jquery.phoenix.js) ([minified](https://raw.github.com/kugaevsky/jquery-phoenix/master/jquery.phoenix.min.js)) or install with [bower](http://bower.io).

## Usage

1. Require jQuery
2. Require [jquery.phoenix.js](https://raw.github.com/kugaevsky/jquery-phoenix/master/jquery.phoenix.js) or its [minified version](https://raw.github.com/kugaevsky/jquery-phoenix/master/jquery.phoenix.min.js)
3. `$('input').phoenix()` – cast the magic
4. `$('input').phoenix('remove')` – clear storage on successful form submission (or any other event your like more)

Something like this

    <form id='stored-form'>
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

You can pass an options object on Phoenix initialization.

    $('.phoenix-input').phoenix({
        namespace: 'phoenixStorage',
        webStorage: 'sessionStorage',
        maxItems: 100,
        saveInterval: 1000,
        clearOnSubmit: '#stored-form',
        keyAttributes: ['tagName', 'id']
      })

Possible options are:

* `namespace` – webStorage namespace (if you don't like default) – *string*: `phoenixStorage`,
* `webStorage` – method used; sessionStorage or localStorage, (localStorage by default) – *string*: `localStorage`,
* `maxItems` – max items to store (every form field is an item) – *integer*: `100`,
* `saveInterval` – how often to save field values to localStorage (milliseconds). If it's negative, field will only be saved when invoking `save` method – *integer*: `1000`
* `clearOnSubmit` – form selector (when you submit this form Phoenix will clean up stored items) – *string*: `false`
* `keyAttributes` - define which element attributes will be used to find the correct element to populate - *array*: `['tagName', 'id', 'name']`

### Methods

When Phoenix initialized you can use API methods to manage it.
Call method with `$(selector).phoenix('methodName')`, where `methodName` is one of these:

* `start` – start saving timer, it will save field values every `saveInterval`ms (saveInterval is an option as you remember)
* `stop` – stop saving timer
* `load` – load value from stored item to field
* `save` – save value from field to stored item
* `remove` – stop saving timer and remove stored item from localStorage

**NB** Phoenix doesn't remove stored item from localStorage by itself. So don't forget to call `remove` event when you don't need filled in form field values anymore or use `clearOnSubmit` option with form id.

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

## Compatibility

### Browsers

Any compatible with HTML5 Web Storage API browser works well with Phoenix.

* Chrome 4+
* Firefox 3.5+
* Safary 4+
* Opera 10.5+
* IE 8+
* All modern mobile browsers (except Opera Mini)

[CanIuse cheatsheet](http://caniuse.com/#feat=namevalue-storage)

### Other plugins

Dozens of plugins make form inputs more powerful and pretty. [Chosen](https://github.com/harvesthq/chosen) or [Select2](https://github.com/ivaynberg/select2) for example. You can use it with Phoenix safely. Just make sure that you initialize Phoenix before these plugins.

## Registries

* [jQuery plugin registry](http://plugins.jquery.com/phoenix/)
* [jQuery plugins](http://jquery-plugins.net/phoenix-jquery-plugin-to-save-form-fields-values)
* [Softpedia](http://webscripts.softpedia.com/script/Forms-and-Controls-C-C/jQuery-Phoenix-81924.html)

## License

Distributed under [MIT license](https://github.com/kugaevsky/jquery-phoenix/blob/master/LICENSE)

## Contributing

Feel free to create pull request of your changes. But only in [CoffeeScript](http://jashkenas.github.io/coffee-script/).

[Almighty contributors](https://github.com/kugaevsky/jquery-phoenix/graphs/contributors).

----

##### Sponsored by [![Roem.ru](http://roem.ru/bitrix/templates/2012/i/fav.ico)](http://roem.ru/) [Roem.ru](http://roem.ru/)

##### Donate to [GitTip](https://www.gittip.com/kugaevsky/) or [![Flattr](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=kugaevsky&url=https%3A%2F%2Fgithub.com%2Fkugaevsky%2Fjquery-phoenix)



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/kugaevsky/jquery-phoenix/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

