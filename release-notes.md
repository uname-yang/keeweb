Release notes
-------------

##### v1.3.0 (2016-09-01)
Generator presets, auto-type and ui improvements  
`+` auto-type improvements  
`+` context menu  
`+` solarized themes  
`+` generator presets  
`+` group reorder  
`+` auto backups  
`+` select field contents on search hotkey  
`+` option to preload default config and file  
`+` save displayed table columns  
`+` confirmation in password change dialog  
`+` inline generator keyboard management  
`+` field references decoding  
`+` copy entries  
`+` option to disable open, new and demo buttons  
`-` fix app redraw in background  
`-` fix idle timer on computer sleep  
`-` fix storage popup when no action is required  
`-` fix loading raw 32-byte and 64-byte keyfiles  
`-` fix data loss on exit with focused field  

##### v1.2.4 (2016-07-20)
`+` digital signature in installer  
`-` fix save to file  
`-` mark file as modified on trash empty  

##### v1.2.3 (2016-07-17)
`+` option to skip lock on minimize under mac  
`-` fix dropbox popup error  
`-` fix auto-type input  

##### v1.2.2 (2016-07-14)
`-` fix special keys auto-type in linux  

##### v1.2.1 (2016-07-12)
`-` fix storage auth popups on desktop  

##### v1.2.0 (2016-07-11)
Auto-type, ui improvements  
`+` allow selecting attachments with click  
`+` save groups collapsed/expanded state  
`+` docker container  
`+` edit and remove tags  
`+` register file associations  
`+` high contrast theme  
`+` ability to increase font size  
`+` improved start page ux on mobile  
`+` option to show app logs  
`+` group info in entry details  
`+` logout from remote storages on disable  
`+` select file for new records  
`+` customizable table view  
`+` ability to load json config  
`*` don't check updates at startup  
`*` repos moved to github organization account  
`*` allow opening same file twice  
`*` local files are not saved to cache  
`-` prevent second app instance on windows  

##### v1.1.4 (2016-04-21)
`-` fixed Firefox loading issues  

##### v1.1.3 (2016-04-21)
`+` google drive stability improvements  
`+` fix some layout bugs  
`-` fix generator preset for empty passwords  
`+` export settings get/set interface  

##### v1.1.2 (2016-04-10)  
`+` option to try beta version in desktop app  
`-` fix notes field text color  
`-` fix some console assertions  
`-` fix message about not found files  
`-` fix deletion to trash when there's no trash folder  

##### v1.1.1 (2016-04-07)  
`+` minimize app on linux  
`+` display remembered keyfile name  
`-` fix #182: save window position on Windows  

##### v1.1.0 (2016-04-05)
Storage providers, one-time passwords, usability improvements  
`+` WebDAV  
`+` Google Drive, OneDrive  
`+` one-time passwords  
`+` option to remember keyfiles  
`+` password generation presets  
`+` open files created without password  
`+` usernames autocomplete  
`+` files open improvements  
`+` beta version app  
`+` option to lock on password copy  
`+` save/restore window position after close  
`+` shortcut to copy username  
`+` regenerate password button  
`+` option to search in title  
`+` shortcut to copy website  
`+` shortcuts while the app is in background  
`+` build for 32-bit linux  
`+` ability to import xml  
`+` warning for kdb files  
`+` hide empty fields  
`+` overall spacing increased  
`+` hide demo button once opened  
`+` show error details on open  
`+` select dropbox folder  
`+` building deb  
`+` theme color for mobile chrome  
`-` fix capslock indicator  
`-` fix file settings input behavior  
`-` fix favicon download  
`-` fix protected fields copy-paste  

##### v1.0.4 (2016-02-25)
Workaround for Chrome bug  
`-` #110: fix font rendering in Chrome  

##### v1.0.3 (2016-02-23)  
`+` #94: warn user about local files  
`-` #92: save files on exit  
`-` #95: unlock by opening settings  
`-` fix crash on arch linux startup  

##### v1.0.2 (2016-02-17)  
`-` #80: dragdrop bug  

##### v1.0.1 (2016-02-14)
Bugfixes  
`-` fixed tags selection  
`-` fixed updater bug  

##### v1.0.0 (2016-02-12)
Performance, stability and quality improvements  
`+` track changes in local files  
`+` mobile layout made more convenient  
`+` command-line option to disable updater  
`+` using system proxy settings for updater  
`+` webapp icon for touch devices  
`-` #80: prevent data loss on group move  
`-` issues with clipboard clear fixed  

##### v0.6.1 (2016-02-02)
App moved to app.keeweb.info  

##### v0.6.0 (2016-01-19)
Improvements  
`+` advanced search  
`+` ability to sync files with changed credentials  
`+` save at exit for desktop app  
`+` more reliable binaries management  
`+` string resources globalization  
`+` San-Francisco font in Chrome OS X  
`+` help/tips  
`+` #67: field editing improvements  
`*` monospace fonts for protected fields  
`*` #68: url display without http  
`+` #50: notification on password copy  
`-` #74: select all in search field  

##### v0.5.1 (2015-12-15)
Layout bugfixes  
`-` #66: keyfile selection in Firefox  
`-` entries list layout issue in iOS Safari  

##### v0.5.0 (2015-12-14)
2-way merge sync  
`*` all files are now opened with offline support  
`*` disallow opening same files twice   
`*` default theme is now blue  
`+` #46: option to show colorful icons  
`+` #45: optional auto-lock on minimize  
`+` option to disable searching for group  
`+` #62: saving files with empty password  
`+` #56: preserve selected entry after close  
`-` #55: custom scrollbar issues  

##### v0.4.6 (2015-11-25)
`-` #32: visual glitches on Windows 10  

##### v0.4.5 (2015-11-25)
Bugfixes  
`-` mobile safari layout issues  
`-` auto-restart in windows app  

##### v0.4.4 (2015-11-22)
Auto-update restart on Windows fixed  

##### v0.4.3 (2015-11-22)
Windows minimize to tray bugfix  

##### v0.4.1, v0.4.2 (2015-11-22)
Auto-update and bugfixes  

##### v0.4.0 (2015-11-22)
Locking, better Dropbox, custom icons, security enhancements, bugfixes  
`+` lock flow, auto-lock  
`+` entries list display table layout  
`+` minimize to tray on windows  
`+` desktop Dropbox  
`+` Dropbox notification in self-hosted apps  
`+` custom icons support  
`+` option to check updates without install  
`+` clear clipboard password after timeout  
`+` trim history by rules  
`-` fixed tag list scrolling  
`-` entry deletion didn't mark file as modified  

##### v0.3.0 (2015-11-14)
Auto-update  
`+` remember menu and list width  
`-` fixed protected field deletion  

##### v0.2.1 (2015-11-10)
Fixed KeePassX compatibility issues

##### v0.2.0 (2015-11-09)
UX improvements, offline, trash, protected fields, bugfixes  
`+` improved open page ux  
`+` trash management  
`+` protected fields support  
`+` keyfiles from Dropbox  
`+` #17: option to hide entries from subgroups  
`+` #5: groups and entries arranging  
`+` #13: increase max generated password length  
`+` #20: default http:// for urls without protocol  
`-` #12: cannot edit entries without title  
`-` #21: history inside history entries  

##### v0.1.1 (2015-11-04)
Bugfix and performance enhancements  
`+` support non-xml keyfiles  
`+` removed limitation for extensions of opened files  
`+` #10: using WebCrypto for better open performance  
`-` #11: can create a group without name  
`-` #3: desktop app quits without question about unsaved changes  
`-` #2: shortcuts are not working in Mac app  

##### v0.1.0 (2015-10-31)
First MVP  
