'use strict';

const Backbone = require('backbone');
const SettingsStore = require('../comp/settings-store');

const AppSettingsModel = Backbone.Model.extend({
    defaults: {
        theme: 'fb',
        locale: null,
        expandGroups: true,
        listViewWidth: null,
        menuViewWidth: null,
        tagsViewHeight: null,
        autoUpdate: 'install',
        clipboardSeconds: 0,
        autoSave: true,
        rememberKeyFiles: false,
        idleMinutes: 15,
        minimizeOnClose: false,
        tableView: false,
        colorfulIcons: false,
        lockOnMinimize: true,
        lockOnCopy: false,
        helpTipCopyShown: false,
        skipOpenLocalWarn: false,
        hideEmptyFields: false,
        skipHttpsWarning: false,
        demoOpened: false,
        fontSize: 0,
        tableViewColumns: null,
        generatorPresets: null,
        canOpen: true,
        canOpenDemo: true,
        canOpenSettings: true,
        canCreate: true,
        canImportXml: true,
        canRemoveLatest: true,
        dropbox: true,
        webdav: true,
        gdrive: true,
        onedrive: true
    },

    initialize: function() {
        this.listenTo(this, 'change', this.save);
    },

    load: function() {
        const data = SettingsStore.load('app-settings');
        if (data) {
            this.upgrade(data);
        }

        if (data) {
            this.set(data, {silent: true});
        }
    },

    upgrade: function(data) {
        if (data.rememberKeyFiles === true) {
            data.rememberKeyFiles = 'data';
        }
    },

    save: function() {
        SettingsStore.save('app-settings', this.attributes);
    }
});

AppSettingsModel.instance = new AppSettingsModel();
AppSettingsModel.instance.load();

module.exports = AppSettingsModel;
