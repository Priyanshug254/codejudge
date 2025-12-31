FROM openjdk:17-slim

WORKDIR /app

# Expects 'Solution.java'
# We compile then run. 
# We'll use a wrapper script or chained command in the engine service to differentiate compile time vs run time errors
# But for simplicity, we can do it inline

CMD javac Solution.java && java Solution
