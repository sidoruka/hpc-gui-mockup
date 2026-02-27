I'd like to build a "clickable" mockup web app which implements a GUI for the Cloud-based HPC.
* The GUI layout, styles and colors shall be similar to the office 365 (see office 365.png).
* Left panel shall contain the following options:
  * Chat - allows to open a chat interface with the LLM model which allows to search, analyze the data
  * Apps group
    * Shell - allows to open a linux shell terminal to the HPC login node in the right pane.
    * Desktop - allows to open a linux Desktop X11 to the HPC login node in the right pane.
    * Jupyter - allows to open a jupyter notebook server GUI running on the HPC login node in the right pane.
    * RStudio - allows to open a rstudio server GUI running on the HPC login node in the right pane.
  * Data group
    * My files - shows all my personal files/folders, this is a user's sandbox
    * Shared with me - shows all files/folders which are shared with me by the other users
    * Common data - shows data storage which is available to all the users or to some group of users
* Left panel shall be collapsible
* Clicking any item in the left menu - shall open a corresponding GUI in the right pane
* Right pane shall support tabs:
  * So if a user opena "Shell" and then opens "Jupyter" - both apps are available in the right pane as two tabs.
  * These tabs shall suport rearranging, e.g. putting them side by side.
* When the app is initially opened and nothing is selected from the left panel - the right pane shall show a prompt proposing to start a chatbot.