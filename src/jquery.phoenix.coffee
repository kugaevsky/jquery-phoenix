#
# Copyright 2013 Nick Kugaevsky
#
# Licensed under the MIT License
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
#
# Phoenix is a simple jQuery plugin to make your form
# input safe (I mean save) in your browser's local storage.
#
# @version 1.2.0
# @url github.com/kugaevsky/jquery-phoenix
# ---------------------
#
# FEATURES:
# - HTML5 localStorage persistance
# - Simple event API
# – Configurable usage
#

(($, window, document) ->

  pluginName = 'phoenix'
  defaults =
    namespace: 'phoenixStorage'
    maxItems: 100
    saveInterval: 1000
    clearOnSubmit: false
    saveOnChange: false
  saveTimers = []

  class Phoenix
    constructor: (@element, option) ->
      @_defaults    = defaults
      @_name        = pluginName

      @$element     = $(@element)
      @options      = $.extend {}, defaults, (option if typeof option is 'object')
      @action       = option if typeof option is 'string'
      @uri          = window.location.host + window.location.pathname
      @storageKey   = [ @options.namespace, @uri, @element.tagName, @element.id, @element.name ].join('.')
      @storageIndexKey = [ @options.namespace, 'index', window.location.host ].join('.')

      @init()

    indexedItems: -> JSON.parse localStorage[@storageIndexKey]

    remove: ->
      @stop()
      localStorage.removeItem @storageKey
      e = $.Event('phnx.removed')
      @$element.trigger(e)
      indexedItems = @indexedItems()
      indexedItems.slice $.inArray(@storageKey, indexedItems), 1
      localStorage[@storageIndexKey] = JSON.stringify indexedItems

    updateIndex: ->
      indexedItems = @indexedItems()
      if $.inArray(@storageKey, indexedItems) == -1
        indexedItems.push @storageKey
        if indexedItems.length > @options.maxItems
          localStorage.removeItem(indexedItems[0])
          indexedItems.shift()
        localStorage[@storageIndexKey] = JSON.stringify(indexedItems)

    load: ->
      savedValue = localStorage[@storageKey]
      if savedValue?
        if @$element.is(":checkbox, :radio")
          @element.checked = JSON.parse savedValue
        else if @element.tagName is "SELECT"
          self = @
          @$element.find('option').prop('selected', false)
          $.each JSON.parse(savedValue), (i, value) ->
            self.$element.find("option[value='#{value}']").prop('selected', true)
        else
          @element.value = savedValue
        e = $.Event('phnx.loaded')
        @$element.trigger(e)

    save: ->
      localStorage[@storageKey] = if @$element.is(":checkbox, :radio")
        @element.checked
      else if @element.tagName is "SELECT"
        selectedValues = $.map(@$element.find("option:selected"), (el) -> el.value)
        JSON.stringify selectedValues
      else
        @element.value
      e = $.Event('phnx.saved')
      @$element.trigger(e)
      @updateIndex()

    start: ->
      self = @
      saveTimer = setInterval (-> self.save()), self.options.saveInterval
      saveTimers.push(saveTimer)
      e = $.Event('phnx.started')
      @$element.trigger(e)

    stop: ->
      saveTimers.forEach (t) -> clearInterval(t)
      e = $.Event('phnx.stopped')
      @$element.trigger(e)

    init: ->
      localStorage[@storageIndexKey] = "[]" if localStorage[@storageIndexKey] == undefined
      switch @action
        when 'remove' then @remove()
        when 'start' then @start()
        when 'stop' then @stop()
        when 'load' then @load()
        when 'save' then @save()
        else
          @load()
          @start()
          self = @
          $(@options.clearOnSubmit).submit((e) -> self.remove()) if @options.clearOnSubmit
          $(@element).change(() -> self.save()) if @options.saveOnChange

  supports_html5_storage = ->
    try
      return "localStorage" of window and window["localStorage"] isnt null
    catch e
      return false

  $.fn[pluginName] = (option) ->
    pluginID = "plugin_#{pluginName}"
    @each (i) ->
      $.data @, pluginID, new Phoenix(@, option) unless $.data(@, pluginID) && !supports_html5_storage()
)(jQuery, window, document)
