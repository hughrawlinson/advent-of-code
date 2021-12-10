#!/bin/bash
year=$1
day=$2
puzzle=$3

directory="./year/$year/day/$day/puzzle/$puzzle"
template="const exampleInput = \`\`;\n\nconst testInput=\`\`;\n\nconst USE_EXAMPLE = true;\n\nconst input = USE_EXAMPLE ? exampleInput : testInput;\n\nexport {};\n\n"

mkdir -p $directory
echo -e "$template" > "$directory/index.ts"
