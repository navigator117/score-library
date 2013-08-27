#!/bin/bash


mkdir -p public
cd public

if [ ! -d "closure-library" ]; then
    git clone https://code.google.com/p/closure-library/
fi
chmod +x ./closure-library/closure/bin/build/closurebuilder.py

cd ..
unzip() {
    python -c "import zipfile,sys,StringIO;zipfile.ZipFile(StringIO.StringIO(sys.stdin.read())).extractall(sys.argv[1] if len(sys.argv) == 2 else '.')" $*
}
wget http://closure-compiler.googlecode.com/files/compiler-latest.zip -O - | unzip support
