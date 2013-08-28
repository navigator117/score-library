MusicXML Javascript Library
===========================

This is a git import of the
[score-library  project on Google Code](https://code.google.com/p/score-library/),
which has an extensive, well-written code base, but hasn't seen any attention in a while.

# Changes I have made

* The repository includes the build scripts that you have to put together
  yourself from the download section on Google Code.

* It includes some bug fixes which have been tracked via this repository's
  issue tracker.

# Compiling

    $ ./get_deps.sh

This will download some dependencies, like the Closure compiler and library.

    $ ./build-scorediv.sh

This generates the final *scorelib.min.js* file.


# Usage

In addition to the *scorelib.min.js*, at minimum, you need to add jQuery:

    <script src="jquery.js"></script>
    <script src="scorelib.min.js"></script>

If you want to work with compressed *.mxl* files, you'll need to add zip.js:

    <script src="zipjs/zip.js"></script>
    <script>
        zip.workerScriptsPath = 'zipjs/';
    </script>

Finally, for certain functionality, like the *ScoreLibrary.ScoreDiv* class,
you also need to provide jQueryUI.


## Using the source version

You can run the uncompiled source version by the library by adding two script
tags:

    <script src="${scorelib}/public/closure-library/closure/goog/base.js"></script>
    <script src="${scorelib}/src/scorelibrary-deps.js"></script>

The dependencies file is needed by Google Closure for loading, and contains
paths that are relative to the closure *base.js*. Thus, the above only works
right if you expose this repository tree as-is. If you use a different
directory layout, you may need to generate a deps file for yourself. It would
go something like this:

    $ ./public/closure-library/closure/bin/build/depswriter.py \
        --root_with_prefix="./src ../../../../src/" > deps.js

Subsequently, you need to explicitly require all classes that you want to use,
to make Closure load the correct JavaScript files:

    goog.require('ScoreLibrary.MusicXMLLoader');
    ScoreLibrary.MusicXMLLoader.create(url, null, function(xml) {_...});


## Rendering MusicXML

See my [demo implementation](http://michael.elsdoerfer.name/musicxml-viewer/) as an example.
