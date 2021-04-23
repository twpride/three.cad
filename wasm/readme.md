this wasm backend is based on the SolveSpace geometric constraint solver:
https://github.com/solvespace/solvespace

compile command
`emcc  ./wasm/solver.c ./wasm/libslvs.a -L./wasm/ -lslvs -o ./static/solver.js -s TOTAL_MEMORY=134217728 -s EXPORTED_FUNCTIONS='[_main, _solver, _free]'`