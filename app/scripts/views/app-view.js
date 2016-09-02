'use strict';

var Backbone = require('backbone'),
    DragView = require('../views/drag-view'),
    MenuView = require('../views/menu/menu-view'),
    FooterView = require('../views/footer-view'),
    ListView = require('../views/list-view'),
    ListWrapView = require('../views/list-wrap-view'),
    DetailsView = require('../views/details/details-view'),
    GrpView = require('../views/grp-view'),
    TagView = require('../views/tag-view'),
    GeneratorPresetsView = require('../views/generator-presets-view'),
    OpenView = require('../views/open-view'),
    SettingsView = require('../views/settings/settings-view'),
    KeyChangeView = require('../views/key-change-view'),
    DropdownView = require('../views/dropdown-view'),
    Alerts = require('../comp/alerts'),
    Keys = require('../const/keys'),
    Timeouts = require('../const/timeouts'),
    KeyHandler = require('../comp/key-handler'),
    IdleTracker = require('../comp/idle-tracker'),
    Launcher = require('../comp/launcher'),
    SettingsManager = require('../util/settings-manager'),
    Locale = require('../util/locale'),
    UpdateModel = require('../models/update-model');

var AppView = Backbone.View.extend({
    el: 'body',

    template: require('templates/app.hbs'),

    events: {
        'contextmenu': 'contextMenu',
        'drop': 'drop',
        'dragover': 'dragover',
        'click a[target=_blank]': 'extLinkClick',
        'mousedown': 'bodyClick'
    },

    views: null,

    initialize: function () {
        this.views = {};
        this.views.menu = new MenuView({ model: this.model.menu });
        this.views.menuDrag = new DragView('x');
        this.views.footer = new FooterView({ model: this.model });
        this.views.listWrap = new ListWrapView({ model: this.model });
        this.views.list = new ListView({ model: this.model });
        this.views.listDrag = new DragView('x');
        this.views.list.dragView = this.views.listDrag;
        this.views.details = new DetailsView();
        this.views.details.appModel = this.model;

        this.views.menu.listenDrag(this.views.menuDrag);
        this.views.list.listenDrag(this.views.listDrag);

        this.listenTo(this.model.settings, 'change:theme', this.setTheme);
        this.listenTo(this.model.settings, 'change:locale', this.setLocale);
        this.listenTo(this.model.settings, 'change:fontSize', this.setFontSize);
        this.listenTo(this.model.files, 'update reset', this.fileListUpdated);

        this.listenTo(Backbone, 'select-all', this.selectAll);
        this.listenTo(Backbone, 'menu-select', this.menuSelect);
        this.listenTo(Backbone, 'lock-workspace', this.lockWorkspace);
        this.listenTo(Backbone, 'show-file', this.showFileSettings);
        this.listenTo(Backbone, 'open-file', this.toggleOpenFile);
        this.listenTo(Backbone, 'save-all', this.saveAll);
        this.listenTo(Backbone, 'remote-key-changed', this.remoteKeyChanged);
        this.listenTo(Backbone, 'key-change-pending', this.keyChangePending);
        this.listenTo(Backbone, 'toggle-settings', this.toggleSettings);
        this.listenTo(Backbone, 'toggle-menu', this.toggleMenu);
        this.listenTo(Backbone, 'toggle-details', this.toggleDetails);
        this.listenTo(Backbone, 'edit-group', this.editGroup);
        this.listenTo(Backbone, 'edit-tag', this.editTag);
        this.listenTo(Backbone, 'edit-generator-presets', this.editGeneratorPresets);
        this.listenTo(Backbone, 'launcher-open-file', this.launcherOpenFile);
        this.listenTo(Backbone, 'user-idle', this.userIdle);
        this.listenTo(Backbone, 'app-minimized', this.appMinimized);
        this.listenTo(Backbone, 'show-context-menu', this.showContextMenu);

        this.listenTo(UpdateModel.instance, 'change:updateReady', this.updateApp);

        window.onbeforeunload = this.beforeUnload.bind(this);
        window.onresize = this.windowResize.bind(this);

        KeyHandler.onKey(Keys.DOM_VK_ESCAPE, this.escPressed, this);
        KeyHandler.onKey(Keys.DOM_VK_BACK_SPACE, this.backspacePressed, this);
        KeyHandler.onKey(Keys.DOM_VK_F12, this.openDevTools, this, KeyHandler.SHORTCUT_ACTION);

        setInterval(this.syncAllByTimer.bind(this), Timeouts.AutoSync);
    },

    render: function () {
        this.$el.html(this.template({
            beta: this.model.isBeta
        }));
        this.panelEl = this.$el.find('.app__panel:first');
        this.views.listWrap.setElement(this.$el.find('.app__list-wrap')).render();
        this.views.menu.setElement(this.$el.find('.app__menu')).render();
        this.views.menuDrag.setElement(this.$el.find('.app__menu-drag')).render();
        this.views.footer.setElement(this.$el.find('.app__footer')).render();
        this.views.list.setElement(this.$el.find('.app__list')).render();
        this.views.listDrag.setElement(this.$el.find('.app__list-drag')).render();
        this.views.details.setElement(this.$el.find('.app__details')).render();
        this.showLastOpenFile();
        return this;
    },

    showOpenFile: function() {
        this.hideContextMenu();
        this.views.menu.hide();
        this.views.menuDrag.hide();
        this.views.listWrap.hide();
        this.views.list.hide();
        this.views.listDrag.hide();
        this.views.details.hide();
        this.views.footer.toggle(this.model.files.hasOpenFiles());
        this.hidePanelView();
        this.hideSettings();
        this.hideOpenFile();
        this.hideKeyChange();
        this.views.open = new OpenView({ model: this.model });
        this.views.open.setElement(this.$el.find('.app__body')).render();
        this.views.open.on('close', this.showEntries, this);
    },

    showLastOpenFile: function() {
        this.showOpenFile();
        var lastOpenFile = this.model.fileInfos.getLast();
        if (lastOpenFile) {
            this.views.open.showOpenFileInfo(lastOpenFile);
        }
    },

    launcherOpenFile: function(path) {
        if (path && /\.kdbx$/i.test(path)) {
            this.showOpenFile();
            this.views.open.showOpenLocalFile(path);
        }
    },

    updateApp: function() {
        if (UpdateModel.instance.get('updateStatus') === 'ready' &&
            !Launcher && !this.model.files.hasOpenFiles()) {
            window.location.reload();
        }
    },

    showEntries: function() {
        this.views.menu.show();
        this.views.menuDrag.show();
        this.views.listWrap.show();
        this.views.list.show();
        this.views.listDrag.show();
        this.views.details.show();
        this.views.footer.show();
        this.hidePanelView();
        this.hideOpenFile();
        this.hideSettings();
        this.hideKeyChange();
    },

    hideOpenFile: function() {
        if (this.views.open) {
            this.views.open.remove();
            this.views.open = null;
        }
    },

    hidePanelView: function() {
        if (this.views.panel) {
            this.views.panel.remove();
            this.views.panel = null;
            this.panelEl.addClass('hide');
        }
    },

    showPanelView: function(view) {
        this.views.listWrap.hide();
        this.views.list.hide();
        this.views.listDrag.hide();
        this.views.details.hide();
        this.hidePanelView();
        this.views.panel = view.setElement(this.panelEl).render();
        this.panelEl.removeClass('hide');
    },

    hideSettings: function() {
        if (this.views.settings) {
            this.model.menu.setMenu('app');
            this.views.settings.remove();
            this.views.settings = null;
        }
    },

    hideKeyChange: function() {
        if (this.views.keyChange) {
            this.views.keyChange.hide();
            this.views.keyChange = null;
        }
    },

    showSettings: function(selectedMenuItem) {
        this.model.menu.setMenu('settings');
        this.views.menu.show();
        this.views.menuDrag.show();
        this.views.listWrap.hide();
        this.views.list.hide();
        this.views.listDrag.hide();
        this.views.details.hide();
        this.hidePanelView();
        this.hideOpenFile();
        this.hideKeyChange();
        this.views.settings = new SettingsView({ model: this.model });
        this.views.settings.setElement(this.$el.find('.app__body')).render();
        if (!selectedMenuItem) {
            selectedMenuItem = this.model.menu.generalSection.get('items').first();
        }
        this.model.menu.select({ item: selectedMenuItem });
        this.views.menu.switchVisibility(false);
    },

    showEditGroup: function() {
        this.showPanelView(new GrpView());
    },

    showEditTag: function() {
        this.showPanelView(new TagView({ model: this.model }));
    },

    showKeyChange: function(file, viewConfig) {
        if (Alerts.alertDisplayed) {
            return;
        }
        if (this.views.keyChange && this.views.keyChange.model.remote) {
            return;
        }
        this.hideSettings();
        this.hidePanelView();
        this.views.menu.hide();
        this.views.listWrap.hide();
        this.views.list.hide();
        this.views.listDrag.hide();
        this.views.details.hide();
        this.views.keyChange = new KeyChangeView({
            model: { file: file, expired: viewConfig.expired, remote: viewConfig.remote }
        });
        this.views.keyChange.setElement(this.$el.find('.app__body')).render();
        this.views.keyChange.on('accept', this.keyChangeAccept.bind(this));
        this.views.keyChange.on('cancel', this.showEntries.bind(this));
    },

    fileListUpdated: function() {
        if (this.model.files.hasOpenFiles()) {
            this.showEntries();
        } else {
            this.showOpenFile();
        }
    },

    showFileSettings: function(e) {
        var menuItem = this.model.menu.filesSection.get('items').find(item => item.get('file').cid === e.fileId);
        if (this.views.settings) {
            if (this.views.settings.file === menuItem.get('file')) {
                this.showEntries();
            } else {
                this.model.menu.select({ item: menuItem });
            }
        } else {
            this.showSettings(menuItem);
        }
    },

    toggleOpenFile: function() {
        if (this.views.open) {
            if (this.model.files.hasOpenFiles()) {
                this.showEntries();
            }
        } else {
            this.showOpenFile();
        }
    },

    beforeUnload: function(e) {
        let exitEvent = { preventDefault() { this.prevented = true; } };
        Backbone.trigger('main-window-will-close', exitEvent);
        if (exitEvent.prevented) {
            Launcher.preventExit(e);
            return;
        }
        if (this.model.files.hasDirtyFiles()) {
            if (Launcher && !Launcher.exitRequested) {
                if (!this.exitAlertShown) {
                    if (this.model.settings.get('autoSave')) {
                        this.saveAndExit();
                        return Launcher.preventExit(e);
                    }
                    this.exitAlertShown = true;
                    Alerts.yesno({
                        header: Locale.appUnsavedWarn,
                        body: Locale.appUnsavedWarnBody,
                        buttons: [
                            {result: 'save', title: Locale.saveChanges},
                            {result: 'exit', title: Locale.discardChanges, error: true},
                            {result: '', title: Locale.appDontExitBtn}
                        ],
                        success: result => {
                            if (result === 'save') {
                                this.saveAndExit();
                            } else {
                                Launcher.exit();
                            }
                        },
                        cancel: () => {
                            Launcher.cancelRestart(false);
                        },
                        complete: () => {
                            this.exitAlertShown = false;
                        }
                    });
                }
                return Launcher.preventExit(e);
            }
            return Locale.appUnsavedWarnBody;
        } else if (Launcher && !Launcher.exitRequested && !Launcher.restartPending &&
                Launcher.canMinimize() && this.model.settings.get('minimizeOnClose')) {
            Launcher.minimizeApp();
            return Launcher.preventExit(e);
        }
    },

    windowResize: function() {
        Backbone.trigger('page-geometry', { source: 'window' });
    },

    escPressed: function() {
        if (this.views.open && this.model.files.hasOpenFiles()) {
            this.showEntries();
        }
    },

    backspacePressed: function(e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    },

    openDevTools: function() {
        if (Launcher && Launcher.devTools) {
            Launcher.openDevTools();
        }
    },

    selectAll: function() {
        this.menuSelect({ item: this.model.menu.allItemsSection.get('items').first() });
    },

    menuSelect: function(opt) {
        this.model.menu.select(opt);
        if (this.views.panel && !this.views.panel.isHidden()) {
            this.showEntries();
        }
    },

    userIdle: function() {
        this.lockWorkspace(true);
    },

    appMinimized: function() {
        if (this.model.settings.get('lockOnMinimize')) {
            this.lockWorkspace(true);
        }
    },

    lockWorkspace: function(autoInit) {
        if (Alerts.alertDisplayed) {
            return;
        }
        if (this.model.files.hasUnsavedFiles()) {
            if (this.model.settings.get('autoSave')) {
                this.saveAndLock();
            } else {
                var message = autoInit ? Locale.appCannotLockAutoInit : Locale.appCannotLock;
                Alerts.alert({
                    icon: 'lock',
                    header: 'Lock',
                    body: message,
                    buttons: [
                        { result: 'save', title: Locale.saveChanges },
                        { result: 'discard', title: Locale.discardChanges, error: true },
                        { result: '', title: Locale.alertCancel }
                    ],
                    checkbox: Locale.appAutoSave,
                    success: (result, autoSaveChecked) => {
                        if (result === 'save') {
                            if (autoSaveChecked) {
                                this.model.settings.set('autoSave', autoSaveChecked);
                            }
                            this.saveAndLock();
                        } else if (result === 'discard') {
                            this.model.closeAllFiles();
                        }
                    }
                });
            }
        } else {
            this.closeAllFilesAndShowFirst();
        }
    },

    saveAndLock: function(complete) {
        var pendingCallbacks = 0,
            errorFiles = [],
            that = this;
        this.model.files.forEach(function(file) {
            if (!file.get('dirty')) {
                return;
            }
            this.model.syncFile(file, null, fileSaved.bind(this, file));
            pendingCallbacks++;
        }, this);
        if (!pendingCallbacks) {
            this.closeAllFilesAndShowFirst();
        }
        function fileSaved(file, err) {
            if (err) {
                errorFiles.push(file.get('name'));
            }
            if (--pendingCallbacks === 0) {
                if (errorFiles.length && that.model.files.hasDirtyFiles()) {
                    if (!Alerts.alertDisplayed) {
                        var alertBody = errorFiles.length > 1 ? Locale.appSaveErrorBodyMul : Locale.appSaveErrorBody;
                        Alerts.error({
                            header: Locale.appSaveError,
                            body: alertBody + ' ' + errorFiles.join(', ')
                        });
                    }
                    if (complete) { complete(true); }
                } else {
                    that.closeAllFilesAndShowFirst();
                    if (complete) { complete(true); }
                }
            }
        }
    },

    saveAndExit: function() {
        this.saveAndLock(result => {
            if (result) {
                Launcher.exit();
            }
        });
    },

    closeAllFilesAndShowFirst: function() {
        var fileToShow = this.model.files.find(file => !file.get('demo') && !file.get('created'));
        this.model.closeAllFiles();
        if (!fileToShow) {
            fileToShow = this.model.fileInfos.getLast();
        }
        if (fileToShow) {
            var fileInfo = this.model.fileInfos.getMatch(fileToShow.get('storage'), fileToShow.get('name'), fileToShow.get('path'));
            if (fileInfo) {
                this.views.open.showOpenFileInfo(fileInfo);
            }
        }
    },

    saveAll: function() {
        this.model.files.forEach(function(file) {
            this.model.syncFile(file);
        }, this);
    },

    syncAllByTimer: function() {
        if (this.model.settings.get('autoSave')) {
            this.saveAll();
        }
    },

    remoteKeyChanged: function(e) {
        this.showKeyChange(e.file, { remote: true });
    },

    keyChangePending: function(e) {
        this.showKeyChange(e.file, { expired: true });
    },

    keyChangeAccept: function(e) {
        this.showEntries();
        if (e.expired) {
            e.file.setPassword(e.password);
            if (e.keyFileData && e.keyFileName) {
                e.file.setKeyFile(e.keyFileData, e.keyFileName);
            } else {
                e.file.removeKeyFile();
            }
        } else {
            this.model.syncFile(e.file, {
                remoteKey: {
                    password: e.password,
                    keyFileName: e.keyFileName,
                    keyFileData: e.keyFileData
                }
            });
        }
    },

    toggleSettings: function(page) {
        var menuItem = page ? this.model.menu[page + 'Section'] : null;
        if (menuItem) {
            menuItem = menuItem.get('items').first();
        }
        if (this.views.settings) {
            if (this.views.settings.page === page || !menuItem) {
                if (this.model.files.hasOpenFiles()) {
                    this.showEntries();
                } else {
                    this.showLastOpenFile();
                    this.views.open.toggleMore();
                }
            } else {
                if (menuItem) {
                    this.model.menu.select({item: menuItem});
                }
            }
        } else {
            this.showSettings();
            if (menuItem) {
                this.model.menu.select({item: menuItem});
            }
        }
    },

    toggleMenu: function() {
        this.views.menu.switchVisibility();
    },

    toggleDetails: function(visible) {
        this.$el.find('.app').toggleClass('app--details-visible', visible);
        this.views.menu.switchVisibility(false);
    },

    editGroup: function(group) {
        if (group && !(this.views.panel instanceof GrpView)) {
            this.showEditGroup();
            this.views.panel.showGroup(group);
        } else {
            this.showEntries();
        }
    },

    editTag: function(tag) {
        if (tag && !(this.views.panel instanceof TagView)) {
            this.showEditTag();
            this.views.panel.showTag(tag);
        } else {
            this.showEntries();
        }
    },

    editGeneratorPresets: function() {
        if (!(this.views.panel instanceof GeneratorPresetsView)) {
            if (this.views.settings) {
                this.showEntries();
            }
            this.showPanelView(new GeneratorPresetsView({ model: this.model }));
        } else {
            this.showEntries();
        }
    },

    isContextMenuAllowed(e) {
        return ['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) < 0;
    },

    contextMenu: function(e) {
        if (this.isContextMenuAllowed(e)) {
            e.preventDefault();
        }
    },

    showContextMenu: function(e) {
        if (e.options && this.isContextMenuAllowed(e)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (this.views.contextMenu) {
                this.views.contextMenu.remove();
            }
            let menu = new DropdownView({ model: e });
            menu.render({
                position: { left: e.pageX, top: e.pageY },
                options: e.options
            });
            menu.on('cancel', e => this.hideContextMenu());
            menu.on('select', e => this.contextMenuSelect(e));
            this.views.contextMenu = menu;
        }
    },

    hideContextMenu: function() {
        if (this.views.contextMenu) {
            this.views.contextMenu.remove();
            delete this.views.contextMenu;
        }
    },

    contextMenuSelect: function(e) {
        this.hideContextMenu();
        Backbone.trigger('context-menu-select', e);
    },

    dragover: function(e) {
        e.preventDefault();
    },

    drop: function(e) {
        e.preventDefault();
    },

    setTheme: function() {
        SettingsManager.setTheme(this.model.settings.get('theme'));
    },

    setFontSize: function() {
        SettingsManager.setFontSize(this.model.settings.get('fontSize'));
    },

    setLocale: function() {
        SettingsManager.setLocale(this.model.settings.get('locale'));
        if (this.views.settings.isVisible()) {
            this.hideSettings();
            this.showSettings();
        }
        this.$el.find('.app__beta:first').text(Locale.appBeta);
    },

    extLinkClick: function(e) {
        if (Launcher) {
            e.preventDefault();
            Launcher.openLink(e.target.href);
        }
    },

    bodyClick: function(e) {
        IdleTracker.regUserAction();
        Backbone.trigger('click', e);
    }
});

module.exports = AppView;
