# react-nativ-recipes

A simple Recipes app I'm working on so that I can digitize my hand-written recipes as well as consildate those with ones I use online.

## Handwriting Recognition
For handwriting recognition, I tried react-native-tesseract-ocr, but it did not work well at all for handwriting (and was tough to get working for non-handwriting as well). So I went with a Firebase ML approach outlined here: https://www.section.io/engineering-education/react-native-firebase-text-recognition/

## Authenticaiton
I'm working on password-less authentication also Firebase Auth (https://rnfirebase.io/auth/usage), but having trouble setting Dynamic Links up. I need Dynamic Links because password-less authentication uses a link sent to an email, and the way to verify that link requires either a web page (which I don't want to pay for at this point), or linking back to the app directly (which requires Dynamic Linking)

### Authentication Notes
* https://dev.to/techtalks/deep-linking-in-react-native-app-with-react-navigation-v5-41id
* https://reactnavigation.org/docs/getting-started/
* https://firebase.google.com/docs/auth/web/email-link-auth
* https://firebase.google.com/docs/auth/android/email-link-auth
* https://firebase.google.com/docs/dynamic-links/custom-domains
* https://developer.android.com/training/app-links/deep-linking
* https://stackoverflow.com/questions/66847608/firebase-dynamic-links-cant-use-google-provided-hostname