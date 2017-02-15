'use strict';

const Backbone = require('backbone');
const Keys = require('../const/keys');
const IdleTracker = require('../comp/idle-tracker');

const shortcutKeyProp = navigator.platform.indexOf('Mac') >= 0 ? 'metaKey' : 'ctrlKey';

const KeyHandler = {
    SHORTCUT_ACTION: 1,
    SHORTCUT_OPT: 2,

    shortcuts: {},
    modal: false,

    init: function() {
        $(document).bind('keypress', this.keypress.bind(this));
        $(document).bind('keydown', this.keydown.bind(this));
    },
    onKey: function(key, handler, thisArg, shortcut, modal, noPrevent) {
        let keyShortcuts = this.shortcuts[key];
        if (!keyShortcuts) {
            this.shortcuts[key] = keyShortcuts = [];
        }
        keyShortcuts.push({ handler: handler, thisArg: thisArg, shortcut: shortcut, modal: modal, noPrevent: noPrevent });
    },
    offKey: function(key, handler, thisArg) {
        if (this.shortcuts[key]) {
            this.shortcuts[key] = _.reject(this.shortcuts[key], sh => {
                return sh.handler === handler && sh.thisArg === thisArg;
            });
        }
    },
    setModal: function(modal) {
        this.modal = modal;
    },
    isActionKey: function(e) {
        return e[shortcutKeyProp];
    },
    keydown: function(e) {
        IdleTracker.regUserAction();
        const code = e.keyCode || e.which;
        const keyShortcuts = this.shortcuts[code];
        if (keyShortcuts && keyShortcuts.length) {
            keyShortcuts.forEach(function(sh) {
                if (this.modal && !sh.modal) {
                    e.stopPropagation();
                    return;
                }
                const isActionKey = this.isActionKey(e);
                switch (sh.shortcut) {
                    case this.SHORTCUT_ACTION:
                        if (!isActionKey) { return; }
                        break;
                    case this.SHORTCUT_OPT:
                        if (!e.altKey) { return; }
                        break;
                    default:
                        if (e.metaKey || e.ctrlKey || e.altKey) { return; }
                        break;
                }
                sh.handler.call(sh.thisArg, e, code);
                if (isActionKey && !sh.noPrevent) {
                    e.preventDefault();
                }
            }, this);
        }
    },
    keypress: function(e) {
        if (!this.modal &&
            e.charCode !== Keys.DOM_VK_RETURN &&
            e.charCode !== Keys.DOM_VK_ESCAPE &&
            e.charCode !== Keys.DOM_VK_TAB &&
            !e.altKey && !e.ctrlKey && !e.metaKey) {
            this.trigger('keypress', e);
        } else if (this.modal) {
            this.trigger('keypress:' + this.modal, e);
        }
    },
    reg: function() {
        IdleTracker.regUserAction();
    }
};

_.extend(KeyHandler, Backbone.Events);

module.exports = KeyHandler;
