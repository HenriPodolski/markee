# Backlog

## MVP
### Todo:
* Bugfix: Change anything in a note, do not save, go to another note, back to previous note = note content gone
* Use title, date and short description besides the file name in filetree item as note description
* Add CSS to RTE editor to be able to see formats
* Add intro/tutorial/about section in HTML and if no files are present create the first file out of it if active file is deleted, switch active file to first file in current baseDir
* Instead of file name display headline/title of note and the beginning/a summary
* Go live on Github pages
### Backlog:
* Add image upload and display from blob/local source
* Add a deleted folder by default that is not being displayed by default and can be activated in the settings, after x days the notes will be deleted
* Check validation of directory and file (if file or folder already exists and valid name)
* Style RTE Confirm dialog for delete directory/file and/or undo (setTimeout 5000 before real file deletion action)
* Switch select for editing RTE or markdown
* Catch Strg + S key combination by showing a toast not telling that auto save is active
* Implement sync to git repository
* Implement settings file to save git credentials in .markee file in JSON format
* Implement settings view to edit settings in .markee file undo/redo for file system and file operations (+ sync with store)

### Features:
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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
