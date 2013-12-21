(function() {
  (function($, window, document) {
    var Phoenix, defaults, pluginName, saveTimers, supports_html5_storage;
    pluginName = 'phoenix';
    defaults = {
      namespace: 'phoenixStorage',
      maxItems: 50,
      saveInterval: 1000,
      clearOnSubmit: false
    };
    saveTimers = [];
    Phoenix = (function() {
      function Phoenix(element, option) {
        this.element = element;
        this._defaults = defaults;
        this._name = pluginName;
        this.$element = $(this.element);
        this.options = $.extend({}, defaults, (typeof option === 'object' ? option : void 0));
        if (typeof option === 'string') {
          this.action = option;
        }
        this.uri = window.location.host + window.location.pathname;
        this.storageKey = [this.options.namespace, this.uri, this.element.tagName, this.element.id, this.element.name].join('.');
        this.storageIndexKey = [this.options.namespace, 'index', window.location.host].join('.');
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
        var e, savedValue, self;
        savedValue = localStorage[this.storageKey];
        if (savedValue != null) {
          if (this.$element.is(":checkbox, :radio")) {
            this.element.checked = JSON.parse(savedValue);
          } else if (this.element.tagName === "SELECT") {
            self = this;
            this.$element.find('option').prop('selected', false);
            $.each(JSON.parse(savedValue), function(i, value) {
              return self.$element.find("option[value='" + value + "']").prop('selected', true);
            });
          } else {
            this.element.value = savedValue;
          }
          e = $.Event('phnx.loaded');
          return this.$element.trigger(e);
        }
      };

      Phoenix.prototype.save = function() {
        var e, selectedValues;
        localStorage[this.storageKey] = this.$element.is(":checkbox, :radio") ? this.element.checked : this.element.tagName === "SELECT" ? (selectedValues = $.map(this.$element.find("option:selected"), function(el) {
          return el.value;
        }), JSON.stringify(selectedValues)) : this.element.value;
        e = $.Event('phnx.saved');
        this.$element.trigger(e);
        return this.updateIndex();
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
        var self;
        if (localStorage[this.storageIndexKey] === void 0) {
          localStorage[this.storageIndexKey] = "[]";
        }
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
            this.load();
            this.start();
            self = this;
            if (this.options.clearOnSubmit) {
              return $(this.options.clearOnSubmit).submit(function(e) {
                return self.remove();
              });
            }
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
        if (!($.data(this, pluginID) && !supports_html5_storage())) {
          return $.data(this, pluginID, new Phoenix(this, option));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
