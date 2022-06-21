 Tiny demo Project

# Configuration for auto-format code
- go to settings.json from vscode
- override properties the same below
  "editor.codeActionsOnSave": [
    "source.organizeImports",
    "source.fixAll"
  ],
  "editor.tabSize": 2,

# How to run the project for developing
- go to https://ft.survivalapp.com/
- sign in
- goto Cookies of https://ft.survivalapp.com/
- change domain of object which has name property is auth_token to localhost
- yarn start

# Steps before creating a PR
- run yarn lint before creating a PR and make sure your new code does not have any error 

# Steps before creating a PR
- run yarn lint before merging into QA and clear all console.*
