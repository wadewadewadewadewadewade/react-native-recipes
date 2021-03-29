# react-nativ-recipes

A simple Recipes app I'm working on so that I can digitize my hand-written recipes as well as consildate those with ones I use online.

## Handwriting Recognition
For handwriting recognition, I tried react-native-tesseract-ocr, but it did not work well at all for handwriting (and was tough to get working for non-handwriting as well). So I went with a Firebase ML approach outlined here: https://www.section.io/engineering-education/react-native-firebase-text-recognition/

## Authenticaiton
I'm working on password-less authentication also Firebase Auth, but having trouble setting Dynamic Links up. I need Dynamic Links because password-less authentication uses a link sent to an email, and the way to verify that link requires either a web page (which I don't want to pay for at this point), or linking back to the app directly (which requires Dynamic Linking)