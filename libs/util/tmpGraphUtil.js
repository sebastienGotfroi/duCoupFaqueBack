function updatePointsIfNewPointIsClosest(position, newPoint, closestPoints){
  const furthestPoint = closestPoints.pop();

  const xDiff = Math.abs(newPoint[0] - position[0]),
        yDiff = Math.abs(newPoint[1] - position[1]);
  if ( 
      ( xDiff > furthestPoint.xDiff && yDiff > furthestPoint.yDiff ) || 
      (distSum = (xDiff + yDiff)) > furthestPoint.distSum 
    ) {
    return false;
  }

  const dist = pythagore(position[0], position[1], newPoint[0], newPoint[1]);

  if(dist > furthestPoint.dist){
    return false;
  }

  newPoint = {};
  newPoint['xDiff'] = xDiff;
  newPoint['yDiff'] = yDiff;
  newPoint['distSum'] = distSum;
  newPoint['dist'] = dist;

  //TODO: Use with a more efficient algorithm?
  // Such as move by halfs, like mergeSort but with only an iterator and our value
  for(let i = 0; i < closestPoints.length; i++){
    if(dist < closestPoints[i].dist){
      closestPoints = closestPoints.splice(i, 0, newPoint);
      break;
    }
  }
  return true;
}

function pythagore(x1, y1, x2, y2){
  return Math.sqrt(
    Math.pow(Math.abs(x2 - x1), 2) +
    Math.pow(Math.abs(x2 - x1), 2)
  );
}

function findClosestBikePath(bikeTrails, home, count = 3){
  let closestPoints = [];
  let i = 0;
  // Populate the first [count] points with the first trail points to prevent an empty array when calculating the closest points
  while(closestPoints.length < count){
    if(bikeTrails[i]){
      let trailPoint = bikeTrails[i].geometry.coordinates;
      let newPoint = {};
      newPoint['xDiff'] = Math.abs(trailPoint[0] - home[0]);
      newPoint['yDiff'] = Math.abs(trailPoint[1] - home[1]);
      newPoint['distSum'] = newPoint['xDiff'] + newPoint['yDiff'];
      newPoint['dist'] = pythagore(home[0], home[1], trailPoint[0], trailPoint[1]);
      // Inserting the point in the array
      for(let j = 0; j <= closestPoints.length; j++){
        if(j === closestPoints.length){
          closestPoints.push(newPoint);
          break;
        }
        if(newPoint.dist < closestPoints[i].dist){
          closestPoints = closestPoints.splice(i,0,newPoint);
          break;
        }
      }
      closestPoints.push(newPoint);
    } else {
      break;
    }
    i++;
  }
  for(bikeTrail of bikeTrails){
    for(point of bikeTrail.geometry.coordinates){
      updatePointsIfNewPointIsClosestPosition(home, point, closestPoints);
    }
  }
  return closestPoints;
}
