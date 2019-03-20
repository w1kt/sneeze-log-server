import moment from 'moment';
import cuid from 'cuid';

class Reflection {
  constructor() {
    this.reflections = [];
  }

  /**
   * 
   * @param {object} reflection object
   */
  create(data) {
    const newReflection = {
      id: cuid(),
      success: data.success || '',
      lowPoint: data.lowPoint || '',
      takeAway: data.takeAway || '',
      createdDate: moment.now(),
      modifiedDate: moment.now()
    }
    this.reflections.push(newReflection);
    return newReflection;
  }

  /**
   * 
   * @param {string} id 
   * @returns {object} reflection object
   */
  findOne(id) {
    return this.reflections.find(reflect => reflect.id === id);
  }
  
  /**
   * @returns {array} returns all reflections
   */
  findAll() {
    return this.reflections;
  }

  /**
   * 
   * @param {string} id 
   * @param {object} data 
   * @returns {object} reflection that was updated
   */
  update(id, data) {
    const reflection = this.findOne(id);
    const index = this.reflections.indexOf(reflection);
    this.reflections[index].success = data['success'] || this.reflections.success;
    this.reflections[index].lowPoint = data['lowPoint'] || this.reflections.lowPoint;
    this.reflections[index].takeAway = data['takeAway'] || this.reflections.takeAway;
    this.reflections[index].modifiedDate = moment.now();
    return this.reflections[index];
  }

  delete(id) {
    const reflections = this.findOne(id);
    const index = this.reflections.indexOf(reflections);
    this.reflections.splice(index, 1);
    return {}
  }
}

export default new Reflection();