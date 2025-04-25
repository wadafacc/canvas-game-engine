export class Comparator {

  compare_to(that, other) {
    return that >= other ? true : false;
  }

  gte(that, other) {
    return that >= other ? true : false;
  }
  
  lte(that, other) {
    return that <= other ? true : false;
  }
}