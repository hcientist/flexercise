# Flexercise Game

Added a score and timer to @twodee's Flexercise

## Scoring
When scoring mode is enabled, players will gain points for each completed layout according to this algorithm:

    max(1, numberOfItemsNotMatchingAtStart * 10000 - milliSecondsElapsed)