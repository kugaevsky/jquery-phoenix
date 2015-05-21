###

Copyright (c) 2013-2015 Nick Kugaevsky

Licensed under the MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

Phoenix is a simple jQuery plugin to make your form
input safe (I mean save) in your browser's local storage.

@version 1.2.3
@url github.com/kugaevsky/jquery-phoenix
---------------------

FEATURES:
- HTML5 localStorage persistance
- Simple event API
– Configurable usage

###


(($, window) ->
  "use strict"

  pluginName = "phoenix"
  defaults =
    namespace: "phoenixStorage"
    webStorage: "localStorage"
    maxItems: 100
    saveInterval: 1000
    clearOnSubmit: false
    saveOnChange: false
    keyAttributes: ["tagName", "id", "name"]
  saveTimers = []

  class Phoenix
    constructor: (@element, option) ->
      @_defaults    = defaults
      @_name        = pluginName

      @$element     = $(@element)
      @options      = $.extend {}, defaults, (option if typeof option is "object")
      @action       = option if typeof option is "string"
      @uri          = window.location.host + window.location.pathname
      storageArray  = [ @options.namespace, @uri ].concat (@element[attr] for attr in @options.keyAttributes)
      @storageKey   = storageArray.join "."
      @storageIndexKey = [ @options.namespace, "index", window.location.host ].join(".")
      @webStorage = window[@options.webStorage]

      @init()

    indexedItems: -> JSON.parse @webStorage[@storageIndexKey]

    remove: ->
      @stop()
      @webStorage.removeItem @storageKey
      e = $.Event("phnx.removed")
      @$element.trigger(e)
      indexedItems = @indexedItems()
      indexedItems.slice $.inArray(@storageKey, indexedItems), 1
      @webStorage[@storageIndexKey] = JSON.stringify indexedItems
      return

    updateIndex: ->
      indexedItems = @indexedItems()
      if $.inArray(@storageKey, indexedItems) == -1
        indexedItems.push @storageKey
        if indexedItems.length > @options.maxItems
          @webStorage.removeItem(indexedItems[0])
          indexedItems.shift()
        @webStorage[@storageIndexKey] = JSON.stringify(indexedItems)
      return

    load: ->
      savedValue = @webStorage[@storageKey]
      if savedValue?
        if @$element.is(":checkbox, :radio")
          @element.checked = JSON.parse savedValue
        else if @element.tagName is "SELECT"
          @$element.find("option").prop("selected", false)
          $.each JSON.parse(savedValue), (i, value) =>
            @$element.find("option[value='#{value}']").prop("selected", true)
        else
          @element.value = savedValue
        e = $.Event("phnx.loaded")
        @$element.trigger(e)

    save: ->
      @webStorage[@storageKey] = if @$element.is(":checkbox, :radio")
        @element.checked
      else if @element.tagName is "SELECT"
        selectedValues = $.map(@$element.find("option:selected"), (el) -> el.value)
        JSON.stringify selectedValues
      else
        @element.value
      e = $.Event("phnx.saved")
      @$element.trigger(e)
      @updateIndex()

    start: ->
      saveTimer = if @options.saveInterval >= 0 then setInterval (=> @save()), @options.saveInterval else setTimeout (=> @save())
      saveTimers.push(saveTimer)
      e = $.Event("phnx.started")
      @$element.trigger(e)

    stop: ->
      saveTimers.forEach (t) -> clearInterval(t)
      e = $.Event("phnx.stopped")
      @$element.trigger(e)

    init: ->
      @webStorage[@storageIndexKey] = "[]" if @webStorage[@storageIndexKey] == undefined
      switch @action
        when "remove" then @remove()
        when "start" then @start()
        when "stop" then @stop()
        when "load" then @load()
        when "save" then @save()
        else
          @load()
          @start()
          $(@options.clearOnSubmit).submit(=> @remove()) if @options.clearOnSubmit
          $(@element).change(() => @save()) if @options.saveOnChange

  supportsHtml5Storage = (webStorage) ->
    try
      return webStorage of window and window[webStorage] isnt null
    catch
      return false

  $.fn[pluginName] = (option) ->
    pluginID = "plugin_#{pluginName}"
    @each ->
      $.data @, pluginID, new Phoenix(@, option) unless $.data(@, pluginID) && !supportsHtml5Storage(option.webStorage || defaults.webStorage)

  return
)(jQuery, window)
