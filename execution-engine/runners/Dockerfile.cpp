FROM gcc:latest

WORKDIR /app

# Expects 'solution.cpp'

CMD g++ -o solution solution.cpp && ./solution
