# Backlog

## MVP
**Todo:**
* Fix conversion of markdown to RTE (check spacings etc.)
* Stop using autosave and implement a modal instead which warns the user if data will be lost (use transition from editor active to not active)
* Add intro/tutorial/about section in HTML and if no files are present create the first file out of it if active file is deleted, switch active file to first file in current baseDir
* In addition to the file name display headline/title/date of note and a summary, No Title, no description if empty
* Add translation
* Add icon
* Switch to editor after note creation
* Fix checkmark icon on form not displayed on iOS Safari
* Editor toolbar should appear above navigation
* Go live on Github pages

**Backlog:**
* Add image upload and display from blob/local source
* Add a deleted folder by default that is not being displayed by default and can be activated in the settings, after x days the notes will be deleted
* Check validation of directory and file (if file or folder already exists and valid name)
* Style RTE Confirm dialog for delete directory/file and/or undo (setTimeout 5000 before real file deletion action)
* Switch select for editing RTE or markdown
* Catch Strg + S key combination by showing a toast not telling that auto save is active
* Implement sync to git repository
* Implement settings file to save git credentials in .markee file in JSON format
* Implement settings view to edit settings in .markee file undo/redo for file system and file operations (and sync with store)

**Features:**
let people write markdown or rte sync between devices works offline

## Expansion phase 1
- [ ] Markdown editing mode (source code)
- [ ] Implement .markee config file to serialize and save last state
- [ ] Versions using git (save and sync)
- [ ] Build as PWA
- [ ] Research spike use LightningFS as fallback and try to make FileAccess API to work with isomorphic git
- [ ] Add file asset upload for image, audio, video etc.
- [ ] Differentiate between different file types (different icon in file tree)
- [ ] Add search
- [ ] Add speech to text feature
- [ ] Versions using git (merge conflicts GUI)

## Resources
* Icons: https://materialdesignicons.com/
* Icons new: https://pictogrammers.com/library/mdil/
* Vanilla JS SPA: https://github.com/pmbstyle/vanilla-js-spa
