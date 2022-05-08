#!/usr/bin/bash

rm game.zip
npm run prod
zip -r game.zip assets/ dist/ index.html style.css
