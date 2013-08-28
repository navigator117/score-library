#! /bin/bash

if [ "$1" = "--debug" ]; then
    extra_args='--compiler_flags="--formatting=PRETTY_PRINT" --compiler_flags="--debug"'
fi

eval ./public/closure-library/closure/bin/build/closurebuilder.py \
--root='./public/closure-library/' \
--root='./src' \
--input='./src/scorelibrary.js' \
--output_mode=compiled \
--compiler_jar=./support/compiler.jar \
--compiler_flags="--compilation_level=WHITESPACE_ONLY" \
--compiler_flags="--create_source_map=./scorelib.map" \
--compiler_flags="--generate_exports" \
--compiler_flags="--externs=./support/externs/html5.js" \
--compiler_flags="--externs=./support/externs/fileapi.js" \
--compiler_flags="--externs=./support/externs/contrib/jquery-1.7.js" \
--compiler_flags="--externs=./support/externs/contrib/zip.js" \
--compiler_flags="--js_output_file=./scorelib.min.js" \
$extra_args
