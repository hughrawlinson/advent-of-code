#!/bin/bash
git add "./year/$1/day/$2/puzzle/$3/index.ts"
git commit -m "Add Year $1 Day $2 Puzzle $3"
git push origin main
