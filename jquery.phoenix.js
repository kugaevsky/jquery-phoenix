(function() {
  (function($, window, document) {
    var Phoenix, defaults, pluginName, saveTimers, supports_html5_storage;
    pluginName = 'phoenix';
    defaults = {
      namespace: 'phoenixStorage',
      maxItems: 50,
      saveInterval: 1000
    };
    saveTimers = [];
    Phoenix = (function() {
      function Phoenix(element, index, options, action) {
        this.element = element;
        this.index = index;
        this.action = action;
        this._defaults = defaults;
        this._name = pluginName;
        this.$element = $(this.element);
        this.options = $.extend({}, defaults, options);
        this.uri = window.location.host + window.location.pathname;
        this.storageKey = this.options.namespace + '.' + this.uri + '.' + this.index.toString();
        this.storageIndexKey = this.options.namespace + '.index.' + window.location.host;
        this.init();
      }

      Phoenix.prototype.indexedItems = function() {
        return JSON.parse(localStorage[this.storageIndexKey]);
      };

      Phoenix.prototype.remove = function() {
        var e, indexedItems;
        this.stop();
        localStorage.removeItem(this.storageKey);
        e = $.Event('phnx.removed');
        this.$element.trigger(e);
        indexedItems = this.indexedItems();
        indexedItems.slice($.inArray(this.storageKey, indexedItems), 1);
        return localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
      };

      Phoenix.prototype.updateIndex = function() {
        var indexedItems;
        indexedItems = this.indexedItems();
        if ($.inArray(this.storageKey, indexedItems) === -1) {
          indexedItems.push(this.storageKey);
          if (indexedItems.length > this.options.maxItems) {
            localStorage.removeItem(indexedItems[0]);
            indexedItems.shift();
          }
          return localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
        }
      };

      Phoenix.prototype.load = function() {
        var e, savedValue;
        savedValue = localStorage[this.storageKey];
        if (savedValue != null) {
          this.element.value = localStorage[this.storageKey];
          e = $.Event('phnx.loaded');
          return this.$element.trigger(e);
        }
      };

      Phoenix.prototype.save = function() {
        var e;
        if (this.element.value != null) {
          localStorage[this.storageKey] = this.element.value;
          e = $.Event('phnx.saved');
          this.$element.trigger(e);
          return this.updateIndex();
        }
      };

      Phoenix.prototype.start = function() {
        var e, saveTimer, self;
        self = this;
        saveTimer = setInterval((function() {
          return self.save();
        }), self.options.saveInterval);
        saveTimers.push(saveTimer);
        e = $.Event('phnx.started');
        return this.$element.trigger(e);
      };

      Phoenix.prototype.stop = function() {
        var e;
        saveTimers.forEach(function(t) {
          return clearInterval(t);
        });
        e = $.Event('phnx.stopped');
        return this.$element.trigger(e);
      };

      Phoenix.prototype.init = function() {
        switch (this.action) {
          case 'remove':
            return this.remove();
          case 'start':
            return this.start();
          case 'stop':
            return this.stop();
          case 'load':
            return this.load();
          case 'save':
            return this.save();
          default:
            if (localStorage[this.storageIndexKey] === void 0) {
              localStorage[this.storageIndexKey] = "[]";
            }
            this.load();
            return this.start();
        }
      };

      return Phoenix;

    })();
    supports_html5_storage = function() {
      var e;
      try {
        return "localStorage" in window && window["localStorage"] !== null;
      } catch (_error) {
        e = _error;
        return false;
      }
    };
    return $.fn[pluginName] = function(option) {
      var pluginID;
      pluginID = "plugin_" + pluginName;
      return this.each(function(i) {
        var action, options;
        if (typeof option === 'object') {
          options = option;
        }
        if (typeof option === 'string') {
          action = option;
        }
        if (!($.data(this, pluginID) && !supports_html5_storage())) {
          return $.data(this, pluginID, new Phoenix(this, i, options, action));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
