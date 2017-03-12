module.exports = {
  updatePointsIfNewPointIsClosest: function(position, newPoint, closestPoints){
    const furthestPoint = closestPoints[closestPoints.length-1];
    const xDiff = Math.abs(newPoint[0] - position[0]),
    yDiff = Math.abs(newPoint[1] - position[1]);
    if ( 
        ( xDiff > furthestPoint.xDiff && yDiff > furthestPoint.yDiff ) || 
        (distSum = (xDiff + yDiff)) > furthestPoint.distSum 
       ) {
      return false;
    }

    const dist = this.pythagore(position[0], position[1], newPoint[0], newPoint[1]);

    if(dist > furthestPoint.dist){
      return false;
    }
    closestPoints.pop();

    newClosePoint = {};
    newClosePoint['xDiff'] = xDiff;
    newClosePoint['yDiff'] = yDiff;
    newClosePoint['distSum'] = distSum;
    newClosePoint['dist'] = dist;
    newClosePoint['coords'] = newPoint;

    //TODO: Use with a more efficient algorithm?
    // Such as move by halfs, like mergeSort but with only an iterator and our value
    let hasUpdated = false;
    for(let i = 0; i < closestPoints.length; i++){
      if(dist < closestPoints[i].dist){
        closestPoints = closestPoints.splice(i, 0, newClosePoint);
        hasUpdated = true;
        break;
      }
    }
    if(!hasUpdated){
      closestPoints.push(newClosePoint);
    }
    return true;
  },

  pythagore: function(x1, y1, x2, y2){
    return Math.sqrt(
        Math.pow(Math.abs(x2 - x1), 2) +
        Math.pow(Math.abs(y2 - y1), 2)
      );
  },

  findClosestBikePath: function (bikeTrails, home, count = 3){
    let closestPoints = [];
    let i = 0;
    // Populate the first [count] points with the first trail points to prevent an empty array when calculating the closest points
    while(closestPoints.length <= count){
      console.log('Populating initial point list with element ' + i);
      if(bikeTrails[i]){
        let trailPoint = bikeTrails[i].geometry.coordinates[0];
        let newPoint = {};
        newPoint['xDiff'] = Math.abs(trailPoint[0] - home[0]);
        newPoint['yDiff'] = Math.abs(trailPoint[1] - home[1]);
        newPoint['distSum'] = newPoint['xDiff'] + newPoint['yDiff'];
        newPoint['dist'] = this.pythagore(home[0], home[1], trailPoint[0], trailPoint[1]);
        newPoint['coords'] = trailPoint;
        for(let j = 0; j <= closestPoints.length; j++){
          console.log('Length: ' + closestPoints.length);
          if(j == closestPoints.length){
            console.log('Reached limit');
            console.log('Index: ' + j);
            closestPoints.push(newPoint);
            break;
          }
          if(newPoint.dist < closestPoints[j].dist){
            closestPoints = closestPoints.splice(i,0,newPoint);
            break;
          }
        }
      } else {
        break;
      }
      i++;
    }
    for(bikeTrail of bikeTrails){
      for(point of bikeTrail.geometry.coordinates){
        if(Array.isArray(point[0])){
          for(realPoint of point){
            this.updatePointsIfNewPointIsClosest(home, realPoint, closestPoints);
          }
        } else{
          this.updatePointsIfNewPointIsClosest(home, point, closestPoints);
        }
      }
    }
    return closestPoints;
  }

}
