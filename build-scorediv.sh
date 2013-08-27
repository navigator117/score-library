#! /bin/bash

./public/closure-library/closure/bin/build/closurebuilder.py \
--root='./public/closure-library/' \
--root='./public/score-library/' \
--namespace="ScoreLibrary.ScoreDiv" \
--output_mode=compiled \
--compiler_jar=./support/compiler.jar \
--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
--compiler_flags="--create_source_map=./js_mapfiles/scorediv-compiled.map" \
--compiler_flags="--generate_exports" \
--compiler_flags="--externs=./support/externs/html5.js" \
--compiler_flags="--externs=./support/externs/fileapi.js" \
--compiler_flags="--externs=./support/externs/contrib/jquery-1.7.js" \
--compiler_flags="--externs=./support/externs/contrib/zip.js" \
--compiler_flags="--js_output_file=./public/scorediv-compiled.js"
