DAMN
====

*Digital Assets Managed Neatly*

About
-----
DAMN is more granular than your run-of-the-mill DMS, it tracks 'assets' within 'files' rather than just the 'files' themselfs. This allows for example to assign a task to a specific mesh with a Blender file, without the overhead of having to specify which mesh in the task's description.

Contact
--------
IRC: irc.freenode.org #peragro


DAMN Refactor
-------------
DAMN has now been split up in several modules:
 
 * DAMN-AT: DAMN's Analyzers and Transcoders framework, the now stand-alone heart of DAMN.
 * DAMN-index: ElasticSearch based indexing for the extracted meta-data.
 * DAMN-rest: The REST-api wrapper around all of DAMN's services.
 * DAMN: the UI that pull it all together.



####The old Repository
https://code.google.com/p/digital-assets-managed-neatly/


Installation
-----

 Install Node.js
 ```
	$ sudo apt-add-repository ppa:chris-lea/node.js
	$ sudo apt-get update && sudo apt-get install nodejs
 ```
 Install yeoman
 ```
	$ sudo npm install -g yeoman
 ```
 Install grunt
 ```
	$ sudo npm install -g grunt-cli
 ```
 Install compass
 ```
	$ sudo gem install compass --version "=0.12.2"
 ```
 Get the DAMN code
 ```
	$ mkdir damn
	$ cd damn
	$ git clone git@github.com:sueastside/damn.git .
 ```
 Install dependencies
 ```
 npm install
 ```
 Start development server
 ```
	$ grunt serve
 ```
