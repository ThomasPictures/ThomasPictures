# Thomas's Picures

https://thomaspictures.github.io/ThomasPictures/

## Things to note

When I say "run the following command", this is how you do it:

1) Once you install the `Git CLI`, you should have an option called "Open Git Bash here" when you right click in Windows Explorer, which opens a new terminal in the directory/folder you right click

2) You want to open the terminal in the `"root"` directory of the `ThomasPictures` project, that is in the very first folder - you can do this by right clicking the `ThomasPictures` folder and openning the Git Bash terminal from that menu

    - You can tell where your terminal is by looking at the colourful text. By default, the yellow section says where you currently are. So you want to be in `~/<some path>/ThomasPictures`

## Things you need to install to get started

`Git CLI` - https://www.git-scm.com/download/win

`Node.js` - https://nodejs.org/en/download/prebuilt-installer

- You can check that this is installed correctly by opening a terminal and running this command `node --version`

Run the following command in the terminal - `npm install`

- This installs all the required packages to run the code

## To Update / Adding new images

1) Add the images to the `./images/` folder, create folders in that directory, whatever

2) Once you are done, open a terminal in the root directory and run the following commands:

    1) `git add ./images` - this says you want to update that folder and add any changes you made

    2) `git commit -m "adding pictures"` - commiting your changes with a nice message
    
        - You can change the message if you want to be clearer what changes you made

    3) `git push` - push your updates to the website (this will take a minute to update on the web page)

