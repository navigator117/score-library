#!/bin/bash

extra_args=()
if [ "$1" = "--debug" ]; then
    extra_args+=(--compiler_flags="--formatting=PRETTY_PRINT")
    extra_args+=(--compiler_flags="--debug")
fi

# Send all of our files to closure, because we have @export's all over the place
# that we need to expose to the user. Let the compiler remove unused code instead.
# https://groups.google.com/d/msg/closure-library-discuss/iFkTR-WLBDo/6bqx8r6-NEUJ
find ./src -name "*.js" | grep -v ./src/renderer/fonts \
    | xargs printf "--input %s " \
    | xargs ./public/closure-library/closure/bin/build/closurebuilder.py \
        --root='./public/closure-library' \
        --root='./src' \
        --output_mode=compiled \
        --compiler_jar=./support/compiler.jar \
        --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
        --compiler_flags="--create_source_map=./scorelib.map" \
        --compiler_flags="--generate_exports" \
        --compiler_flags="--externs=./support/externs/html5.js" \
        --compiler_flags="--externs=./support/externs/fileapi.js" \
        --compiler_flags="--externs=./support/externs/contrib/jquery-1.7.js" \
        --compiler_flags="--externs=./support/externs/contrib/zip.js" \
        --compiler_flags="--js_output_file=./scorelib.min.js" \
        "${extra_args[@]}"
